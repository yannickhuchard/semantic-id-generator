#!/usr/bin/env node
import { runServerCli } from '../src/server.js';

runServerCli().catch(error => {
  console.error('[semantic-id-generator-mcp-server] Fatal error:', error);
  process.exit(1);
});

