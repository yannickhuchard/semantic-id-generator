import { expect } from 'chai';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Semantic ID Generator MCP stdio server', function () {
  this.timeout(10000);

  let client;
  let transport;

  beforeEach(async function () {
    const repoRoot = resolve(__dirname, '../../..');
    const serverScript = resolve(repoRoot, 'packages/semantic-id-generator-mcp/bin/server.js');

    transport = new StdioClientTransport({
      command: process.execPath,
      args: [serverScript, '--default-preset', 'dataset'],
      cwd: repoRoot,
      stderr: 'pipe'
    });

    const stderrStream = transport.stderr;
    if (stderrStream) {
      stderrStream.on('data', chunk => {
        process.stderr.write(`[server] ${chunk}`);
      });
    }

    client = new Client({
      name: 'semantic-id-generator-mcp-stdio-tests',
      version: '0.0.0'
    });

    await client.connect(transport);
  });

  afterEach(async function () {
    if (client) {
      await client.close();
      client = null;
    }
    if (transport) {
      await transport.close();
      transport = null;
    }
  });

  it('initializes over stdio and lists tools', async function () {
    const { tools } = await client.listTools();
    const toolNames = tools.map(tool => tool.name);

    expect(toolNames).to.include.members([
      'generate-semantic-id',
      'inspect-semantic-id',
      'list-semantic-id-presets'
    ]);
  });

  it('generates and inspects a semantic ID over stdio', async function () {
    const generation = await client.callTool({
      name: 'generate-semantic-id',
      arguments: { dataConceptName: 'dataset' }
    });

    expect(generation.structuredContent.semanticId).to.be.a('string');

    const inspection = await client.callTool({
      name: 'inspect-semantic-id',
      arguments: {
        semanticId: generation.structuredContent.semanticId
      }
    });

    expect(inspection.structuredContent.isValid).to.be.true;
  });
});

