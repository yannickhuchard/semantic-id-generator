/**
 * Base64 compartment strategy showcase.
 *
 * Run with:
 *   node code_samples/string-strategies/base64-compartment/sample.js
 */
import SemanticIDGenerator from '../../../index.js';

const generator = new SemanticIDGenerator({
  compartments: [
    { name: 'prefix', length: 4, generationStrategy: 'visible characters' },
    { name: 'payload', length: 16, generationStrategy: 'base64' },
    { name: 'checksum', length: 8, generationStrategy: 'numbers' }
  ]
});

const id = generator.generateSemanticID('document');

console.log('Generated document ID:', id);
console.log('Base64 payload length:', generator.configuration.compartments[1].length);

