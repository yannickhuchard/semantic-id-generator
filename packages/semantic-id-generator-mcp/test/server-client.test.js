import { expect } from 'chai';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createSemanticIdServer } from '../src/server.js';

describe('Semantic ID Generator MCP server', function () {
  let server;
  let client;
  let clientTransport;

  beforeEach(async function () {
    server = createSemanticIdServer({ defaultPreset: 'dataset' });
    const transports = InMemoryTransport.createLinkedPair();
    [clientTransport] = transports;
    const serverTransport = transports[1];

    await server.connect(serverTransport);
    client = new Client({
      name: 'semantic-id-generator-mcp-tests',
      version: '0.0.0'
    });
    await client.connect(clientTransport);
  });

  afterEach(async function () {
    if (client) {
      await client.close();
      client = null;
    }
    if (server) {
      await server.close();
      server = null;
    }
    if (clientTransport) {
      await clientTransport.close();
      clientTransport = null;
    }
  });

  it('exposes the expected MCP tools', async function () {
    const { tools } = await client.listTools();
    const toolNames = tools.map(tool => tool.name);

    expect(toolNames).to.include.members([
      'generate-semantic-id',
      'inspect-semantic-id',
      'list-semantic-id-presets'
    ]);
  });

  it('generates and validates semantic identifiers end-to-end', async function () {
    const generation = await client.callTool({
      name: 'generate-semantic-id',
      arguments: {
        dataConceptName: 'contract',
        preset: 'contract',
        includeMetadata: true
      }
    });

    expect(generation.structuredContent).to.have.property('semanticId').that.is.a('string');
    expect(generation.structuredContent.metadata).to.include({ key: 'contract' });

    const inspection = await client.callTool({
      name: 'inspect-semantic-id',
      arguments: {
        semanticId: generation.structuredContent.semanticId,
        preset: 'contract'
      }
    });

    expect(inspection.structuredContent.isValid).to.be.true;
  });

  it('returns the preset catalog when requested', async function () {
    const catalog = await client.callTool({
      name: 'list-semantic-id-presets',
      arguments: { includeConfiguration: true }
    });

    expect(catalog.structuredContent.presets).to.be.an('array').that.is.not.empty;
    expect(catalog.structuredContent.presets[0]).to.have.property('metadata');
  });

  it('supports custom configuration overrides when generating IDs', async function () {
    const generation = await client.callTool({
      name: 'generate-semantic-id',
      arguments: {
        dataConceptName: 'custom',
        configuration: {
          dataConceptSeparator: '#',
          compartmentSeparator: '.',
          compartments: [
            { name: 'alpha', length: 2, generationStrategy: 'alphanumeric' },
            { name: 'numeric', length: 3, generationStrategy: 'numbers' }
          ]
        }
      }
    });

    expect(generation.structuredContent.semanticId).to.match(/^custom#/);
    expect(generation.structuredContent.configuration.dataConceptSeparator).to.equal('#');
    expect(generation.structuredContent.configuration.compartmentSeparator).to.equal('.');
  });

  it('flags invalid semantic identifiers through inspection', async function () {
    const inspection = await client.callTool({
      name: 'inspect-semantic-id',
      arguments: {
        semanticId: 'contract|invalid',
        preset: 'contract'
      }
    });

    expect(inspection.structuredContent.isValid).to.be.false;
    expect(inspection.structuredContent.issues).to.be.an('array').that.is.not.empty;
  });

  it('exposes preset catalog as an MCP resource', async function () {
    const { resources } = await client.listResources({});
    const catalogResource = resources.find(resource => resource.uri === 'semantic-id-generator://preset-catalog');
    expect(catalogResource).to.exist;

    const resourcePayload = await client.readResource({ uri: catalogResource.uri });
    expect(resourcePayload.contents).to.be.an('array').that.is.not.empty;

    const json = JSON.parse(resourcePayload.contents[0].text);
    expect(json).to.have.property('presets').that.is.an('array').that.is.not.empty;
  });
});

