import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import process from 'node:process';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');
const PACKAGE_VERSION = pkg.version ?? '0.0.0';

export async function runClientCli(argv = process.argv.slice(2)) {
  const { values } = parseArgs({
    args: argv,
    options: {
      help: { type: 'boolean', short: 'h' },
      server: { type: 'string' },
      'server-arg': { type: 'string', multiple: true },
      tool: { type: 'string' },
      args: { type: 'string' },
      interactive: { type: 'boolean' },
      'list-tools': { type: 'boolean' }
    },
    allowPositionals: true
  });

  if (values.help) {
    printClientHelp();
    return;
  }

  const serverScriptPath = fileURLToPath(new URL('../bin/server.js', import.meta.url));
  let serverCommand = values.server ?? process.execPath;
  let serverArgs = values['server-arg'] ?? [];

  if (!values.server) {
    serverArgs = [serverScriptPath, ...serverArgs];
  }
  const interactive = values.interactive ?? !values.tool;

  const client = new Client({
    name: 'semantic-id-generator-mcp-client',
    version: PACKAGE_VERSION
  });

  const transport = new StdioClientTransport({
    command: serverCommand,
    args: serverArgs,
    env: process.env,
    stderr: 'pipe'
  });

  const stderrStream = transport.stderr;
  if (stderrStream) {
    stderrStream.on('data', chunk => {
      process.stderr.write(`[server] ${chunk}`);
    });
  }

  try {
    await client.connect(transport);
  } catch (error) {
    console.error('[semantic-id-generator-mcp-client] Unable to connect to server.');
    console.error(formatError(error));
    await transport.close();
    process.exit(1);
  }

  console.error(
    `[semantic-id-generator-mcp-client] Connected to "${serverCommand}" (pid: ${transport.pid ?? 'unknown'}).`
  );

  const toolResult = await client.listTools();
  const availableTools = toolResult.tools ?? [];

  process.on('SIGINT', async () => {
    console.error('\n[semantic-id-generator-mcp-client] Shutting down...');
    await shutdown(client);
    process.exit(0);
  });

  if (values['list-tools']) {
    renderToolList(availableTools);
    await shutdown(client);
    return;
  }

  if (values.tool) {
    let parsedArgs = {};
    if (values.args) {
      parsedArgs = parseJson(values.args);
    }

    await invokeTool(client, values.tool, parsedArgs);
    await shutdown(client);
    return;
  }

  if (!interactive) {
    console.error('[semantic-id-generator-mcp-client] No tool specified and interactive mode disabled. Nothing to do.');
    await shutdown(client);
    return;
  }

  renderToolList(availableTools);
  await interactiveLoop(client);
  await shutdown(client);
}

async function interactiveLoop(client) {
  const rl = readline.createInterface({ input, output });
  console.log("Type a tool name followed by JSON arguments, 'list' to refresh tools, or 'exit' to quit.");

  while (true) {
    const line = (await rl.question('mcp> ')).trim();
    if (!line) {
      continue;
    }

    if (line === 'exit' || line === 'quit') {
      break;
    }

    if (line === 'list') {
      const tools = await client.listTools();
      renderToolList(tools.tools ?? []);
      continue;
    }

    const [toolName, ...rest] = line.split(' ');
    if (!toolName) {
      console.error('Provide a tool name.');
      continue;
    }

    const argsText = rest.join(' ').trim();
    let parsedArgs = {};
    if (argsText) {
      try {
        parsedArgs = JSON.parse(argsText);
      } catch (error) {
        console.error(`Invalid JSON: ${formatError(error)}`);
        continue;
      }
    }

    await invokeTool(client, toolName, parsedArgs);
  }

  rl.close();
}

async function invokeTool(client, toolName, args) {
  try {
    const result = await client.callTool({
      name: toolName,
      arguments: args
    });

    renderToolResult(toolName, result);
  } catch (error) {
    console.error(`[semantic-id-generator-mcp-client] Tool "${toolName}" failed: ${formatError(error)}`);
  }
}

function renderToolList(tools) {
  if (!tools.length) {
    console.log('No tools exposed by the server.');
    return;
  }

  console.log('Available tools:');
  for (const tool of tools) {
    console.log(` • ${tool.name}${tool.description ? ` — ${tool.description}` : ''}`);
  }
}

function renderToolResult(toolName, result) {
  if (result.isError) {
    console.error(`[${toolName}] Error: ${extractText(result.content)}`);
    return;
  }

  const text = extractText(result.content);
  if (text) {
    console.log(`[${toolName}] ${text}`);
  }

  if (result.structuredContent) {
    console.log(JSON.stringify(result.structuredContent, null, 2));
  }
}

function extractText(content = []) {
  if (!Array.isArray(content)) {
    return '';
  }

  return content
    .filter(item => item?.type === 'text')
    .map(item => item.text)
    .join('\n');
}

function parseJson(raw) {
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Failed to parse JSON arguments: ${formatError(error)}`);
    process.exit(1);
  }
}

async function shutdown(client) {
  await client.close();
}

function formatError(error) {
  return error instanceof Error ? error.message : String(error);
}

function printClientHelp() {
  console.log(`Semantic ID Generator MCP Client

Usage:
  semantic-id-generator-mcp-client [options]

Options:
  --server <command>        Command used to start the MCP server (default: "node ./bin/server.js")
  --server-arg <value>      Additional argument passed to the server command (repeatable)
  --tool <name>             Call a tool once and exit
  --args '<json>'           JSON arguments used with --tool
  --list-tools              Print available tools and exit
  --interactive             Force interactive mode (default when --tool is not provided)
  -h, --help                Show this help message
`);
}

