import { createRequire } from 'node:module';
import { parseArgs } from 'node:util';
import process from 'node:process';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import SemanticIDGenerator, {
  SemanticIDInspector,
  getPresetMetadata,
  listDomainPresets,
  resolvePresetConfiguration
} from 'semantic-id-generator';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');
const PACKAGE_VERSION = pkg.version ?? '0.0.0';

const KNOWN_PRESETS = listDomainPresets();
const DEFAULT_PRESET = KNOWN_PRESETS.includes('dataset') ? 'dataset' : KNOWN_PRESETS[0];

const GENERATION_STRATEGIES = [
  'all characters',
  'visible characters',
  'numbers',
  'alphanumeric',
  'hexadecimal',
  'base64',
  'passphrase'
] ;

const CompartmentSchema = z.object({
  name: z.string().min(1).max(64).describe('Identifier for the compartment.'),
  length: z.number().int().min(1).max(64).describe('Number of characters to generate.'),
  generationStrategy: z.enum(GENERATION_STRATEGIES).describe('Random generation strategy to use.')
});

const ConfigurationSchema = z
  .object({
    preset: z.string().optional().describe('Optional preset name to extend.'),
    dataConceptSeparator: z.string().min(1).max(5).optional(),
    compartmentSeparator: z.string().min(1).max(5).optional(),
    languageCode: z.string().min(3).max(8).optional(),
    compartments: z.array(CompartmentSchema).min(1).max(12).optional()
  })
  .describe('Full Semantic ID Generator configuration or overrides.');

const GenerateSemanticIdInput = z.object({
  dataConceptName: z
    .string()
    .min(1)
    .describe('Concept name prefix placed before the data concept separator.'),
  preset: z
    .string()
    .optional()
    .describe('Preset to use when configuration is not supplied. Must match list-domain-presets.'),
  configuration: ConfigurationSchema.optional(),
  includeMetadata: z.boolean().optional().default(true).describe('Include preset metadata in structured content.')
});

const InspectSemanticIdInput = z.object({
  semanticId: z.string().min(1).describe('Full semantic ID to inspect.'),
  preset: z
    .string()
    .optional()
    .describe('Preset to enforce during inspection when configuration is not provided.'),
  configuration: ConfigurationSchema.optional()
});

const ListPresetsInput = z
  .object({
    includeConfiguration: z.boolean().optional().default(false)
  })
  .default({});

export function createSemanticIdServer(options = {}) {
  const { defaultPreset = DEFAULT_PRESET } = options;
  validatePreset(defaultPreset);

  const server = new McpServer(
    {
      name: 'semantic-id-generator-mcp',
      version: PACKAGE_VERSION
    },
    {
      instructions:
        'Expose Semantic ID Generator as MCP tools. Use generate-semantic-id, inspect-semantic-id, or list-semantic-id-presets.'
    }
  );

  registerTools(server, defaultPreset);
  registerResources(server);

  return server;
}

export async function runServerCli(argv = process.argv.slice(2)) {
  const { values } = parseArgs({
    args: argv,
    options: {
      help: { type: 'boolean', short: 'h' },
      'default-preset': { type: 'string' },
      'list-presets': { type: 'boolean' }
    },
    allowPositionals: true
  });

  if (values.help) {
    printServerHelp();
    return;
  }

  if (values['list-presets']) {
    printPresetCatalog();
    return;
  }

  const defaultPreset = values['default-preset'] ?? DEFAULT_PRESET;
  validatePreset(defaultPreset);

  const server = createSemanticIdServer({ defaultPreset });
  const transport = new StdioServerTransport();

  await server.connect(transport);
  console.error(
    `[semantic-id-generator-mcp-server] Ready on stdio with default preset "${defaultPreset}". Press Ctrl+C to exit.`
  );

  process.on('SIGINT', async () => {
    console.error('\n[semantic-id-generator-mcp-server] Shutting down...');
    await server.close();
    process.exit(0);
  });
}

function registerTools(server, defaultPreset) {
  server.registerTool(
    'generate-semantic-id',
    {
      title: 'Generate Semantic ID',
      description: 'Generate a new semantic identifier using a preset or custom configuration.',
      inputSchema: GenerateSemanticIdInput
    },
    async args => {
      try {
        const configInput = resolveConfigurationInput({
          configuration: args.configuration,
          preset: args.preset,
          dataConceptName: args.dataConceptName,
          defaultPreset
        });

        const generator = new SemanticIDGenerator(configInput);
        const semanticId = generator.generateSemanticID(args.dataConceptName);
        const presetMetadata = getPresetMetadataSafe(generator.configuration.preset);

        const summary = `Generated semantic ID ${semanticId} (${generator.configuration.preset ?? 'custom'} preset).`;
        return {
          content: [{ type: 'text', text: summary }],
          structuredContent: {
            semanticId,
            dataConceptName: args.dataConceptName,
            configuration: generator.configuration,
            metadata: args.includeMetadata ? presetMetadata : null
          }
        };
      } catch (error) {
        return server.createToolError(formatError(error));
      }
    }
  );

  server.registerTool(
    'inspect-semantic-id',
    {
      title: 'Inspect Semantic ID',
      description: 'Validate an existing semantic identifier and return compartment level diagnostics.',
      inputSchema: InspectSemanticIdInput
    },
    async args => {
      try {
        const inspectorConfig =
          args.configuration ??
          (args.preset
            ? { preset: args.preset }
            : resolveConfigurationInput({
                preset: args.preset,
                configuration: args.configuration,
                dataConceptName: '',
                defaultPreset
              }));

        const inspector = new SemanticIDInspector(inspectorConfig);
        const inspection = inspector.inspect(args.semanticId);
        const summary = inspection.isValid
          ? `Semantic ID "${inspection.semanticId}" is valid.`
          : `Semantic ID "${inspection.semanticId}" is invalid.`;

        return {
          content: [
            {
              type: 'text',
              text: summary
            }
          ],
          structuredContent: inspection
        };
      } catch (error) {
        return server.createToolError(formatError(error));
      }
    }
  );

  server.registerTool(
    'list-semantic-id-presets',
    {
      title: 'List Semantic ID Presets',
      description: 'Enumerate built-in Semantic ID Generator presets with metadata.',
      inputSchema: ListPresetsInput
    },
    async args => {
      try {
        const includeConfiguration = args?.includeConfiguration ?? false;
        const presets = buildPresetCatalog(includeConfiguration);
        return {
          content: [
            {
              type: 'text',
              text: `Found ${presets.length} preset(s).`
            }
          ],
          structuredContent: {
            presets
          }
        };
      } catch (error) {
        return server.createToolError(formatError(error));
      }
    }
  );
}

function registerResources(server) {
  const catalogUri = 'semantic-id-generator://preset-catalog';
  server.resource(
    'semantic-id-generator-presets',
    catalogUri,
    {
      mimeType: 'application/json',
      description: 'Full preset catalog with resolved configuration and metadata.'
    },
    async () => ({
      contents: [
        {
          uri: catalogUri,
          mimeType: 'application/json',
          text: JSON.stringify(
            {
              generatedAt: new Date().toISOString(),
              presets: buildPresetCatalog(true)
            },
            null,
            2
          )
        }
      ]
    })
  );
}

function resolveConfigurationInput({ configuration, preset, dataConceptName, defaultPreset }) {
  if (configuration) {
    if (configuration.preset) {
      const { preset: presetName, ...overrides } = configuration;
      return resolvePresetConfiguration(presetName, overrides);
    }
    return configuration;
  }

  if (preset) {
    validatePreset(preset);
    return { preset };
  }

  const normalized = dataConceptName?.trim().toLowerCase();
  const inferredPreset =
    KNOWN_PRESETS.find(candidate => candidate.toLowerCase() === normalized) ?? defaultPreset ?? DEFAULT_PRESET;

  validatePreset(inferredPreset);
  return { preset: inferredPreset };
}

function buildPresetCatalog(includeConfiguration) {
  return KNOWN_PRESETS.map(name => {
    const metadata = getPresetMetadata(name);
    return {
      name,
      metadata,
      ...(includeConfiguration && { configuration: resolvePresetConfiguration(name) })
    };
  });
}

function validatePreset(presetName) {
  if (!KNOWN_PRESETS.includes(presetName)) {
    throw new Error(
      `Unknown preset "${presetName}". Available presets: ${KNOWN_PRESETS.map(p => `"${p}"`).join(', ')}.`
    );
  }
}

function getPresetMetadataSafe(presetName) {
  if (!presetName) {
    return null;
  }

  try {
    return getPresetMetadata(presetName);
  } catch {
    return null;
  }
}

function formatError(error) {
  return error instanceof Error ? error.message : String(error);
}

function printServerHelp() {
  console.log(`Semantic ID Generator MCP Server

Usage:
  semantic-id-generator-mcp-server [options]

Options:
  --default-preset <name>  Preset to use when callers do not specify one (default: ${DEFAULT_PRESET})
  --list-presets           Print built-in presets and exit
  -h, --help               Show this help message
`);
}

function printPresetCatalog() {
  const catalog = buildPresetCatalog(true);
  console.log(JSON.stringify({ presets: catalog }, null, 2));
}

