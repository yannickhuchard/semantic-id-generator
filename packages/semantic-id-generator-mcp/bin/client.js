#!/usr/bin/env node
import { runClientCli } from '../src/client.js';

runClientCli().catch(error => {
  console.error('[semantic-id-generator-mcp-client] Fatal error:', error);
  process.exit(1);
});

