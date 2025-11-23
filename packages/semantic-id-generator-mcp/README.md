# Semantic ID Generator MCP Companion

This companion package exposes the `semantic-id-generator` library through the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/docs/getting-started/intro). It ships two command line entry points:

- `semantic-id-generator-mcp-server` – a stdio MCP server that publishes Semantic ID Generator tools.
- `semantic-id-generator-mcp-client` – a lightweight stdio client inspired by the official [build-client tutorial](https://modelcontextprotocol.io/docs/develop/build-client) for quick manual testing without an AI assistant.

> ℹ️ The core `semantic-id-generator` library stays lightweight. MCP-specific dependencies live inside this companion package so app developers only install them when they actually need MCP integrations.

## Installation

```bash
git clone https://github.com/yannickhuchard/semantic-id-generator.git
cd semantic-id-generator
npm install                       # installs root deps (semantic-id-generator library)

cd packages/semantic-id-generator-mcp
npm install                       # installs MCP-specific deps
```

After installing you can invoke the bins locally with `npx`:

```bash
npx semantic-id-generator-mcp-server --list-presets
npx semantic-id-generator-mcp-client --list-tools
```

When the package is published to npm you will be able to run the same commands from anywhere via `npx semantic-id-generator-mcp-server`.

## Quick start

1. **Start the MCP server** (stdio mode, default preset `dataset`):
   ```bash
   npx semantic-id-generator-mcp-server --default-preset dataset
   ```
2. **(Optional) Drive it locally** with the companion CLI client:
   ```bash
   npx semantic-id-generator-mcp-client
   ```
3. **Register the server with your MCP host** (Cursor, Claude Desktop, etc.) using one of the JSON snippets in [`examples/`](./examples).
4. **Call tools** (`generate-semantic-id`, `inspect-semantic-id`, `list-semantic-id-presets`) from the MCP host exactly as you would any other tool.
5. **Run tests** at any time to verify the server:
   ```bash
   npm test
   ```

## Server Usage

Run the server on stdio (ideal for Cursor, Claude Desktop, or any MCP client):

```
npx semantic-id-generator-mcp-server --default-preset product
```

Published tools:

| Tool | Description | Arguments |
| ---- | ----------- | --------- |
| `generate-semantic-id` | Generates a fresh Semantic ID. | `dataConceptName` (string), optional `preset`, optional `configuration`, optional `includeMetadata`. |
| `inspect-semantic-id` | Validates an existing Semantic ID. | `semanticId` (string), optional `preset`, optional `configuration`. |
| `list-semantic-id-presets` | Lists preset metadata (optionally including configurations). | Optional `includeConfiguration` boolean. |

The server also publishes a resource at `semantic-id-generator://preset-catalog` with the resolved preset catalog so AI agents can ingest the schema definitions without asking the tools.

## Client Usage

The client starts a server command (defaults to `semantic-id-generator-mcp-server`), performs the MCP handshake, and then lets you trigger tools manually:

```
npx semantic-id-generator-mcp-client
```

Interactive shell commands:

- `list` – refresh the tool list.
- `<toolName> { "json": "args" }` – call a tool with JSON arguments.
- `exit` – quit the session.

You can also execute a single tool without entering the shell:

```
npx semantic-id-generator-mcp-client --tool generate-semantic-id --args '{"dataConceptName":"contract","preset":"contract"}'
```

## Integrating with AI Assistants

Register the stdio server command (`npx semantic-id-generator-mcp-server`) inside Cursor AI, Claude Desktop, or any MCP-compatible assistant. The assistant receives rich structured responses (semantic IDs, inspection diagnostics, preset catalogs) and can use them during reasoning or code generation. Because the server follows the MCP specification, it is automatically discoverable by clients that implement standard tool discovery.

### JSON configuration examples

Two ready-to-use MCP client snippets live under [`examples/`](./examples):

- [`mcp-client-published.json`](./examples/mcp-client-published.json) – points to the published npm package via `npx semantic-id-generator-mcp-server`.
- [`mcp-client-local.json`](./examples/mcp-client-local.json) – launches the server from the local workspace using `node ./packages/semantic-id-generator-mcp/bin/server.js` (make sure the client replaces `${workspaceFolder}` with its checkout path).

Drop the relevant JSON into your MCP client’s configuration to immediately expose the Semantic ID Generator tools.

### Automated testing

The MCP companion includes two mocha suites:

| Suite | Description |
| --- | --- |
| `test/server-client.test.js` | Uses the SDK’s in-memory transport to exercise tool discovery, generation + inspection flows, configuration overrides, error handling, and the preset catalog resource. |
| `test/server-stdio.test.js` | Spawns the actual CLI server via stdio and performs the MCP handshake plus a generate/inspect round trip, ensuring the published `semantic-id-generator-mcp-server` command initializes correctly. |

Run `npm test` inside `packages/semantic-id-generator-mcp` to execute both suites. Every test runs automatically in CI to guard against protocol regressions.

