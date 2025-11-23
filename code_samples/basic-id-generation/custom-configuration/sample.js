/**
 * Custom configuration with mixed strategies and separators.
 *
 * Run with:
 *   node code_samples/basic-id-generation/custom-configuration/sample.js
 */
import SemanticIDGenerator from '../../../index.js';

const generator = new SemanticIDGenerator({
  dataConceptSeparator: ':',
  compartmentSeparator: '/',
  compartments: [
    { name: 'visible', length: 6, generationStrategy: 'visible characters' },
    { name: 'numeric', length: 6, generationStrategy: 'numbers' },
    { name: 'hex', length: 8, generationStrategy: 'hexadecimal' },
    { name: 'base64', length: 12, generationStrategy: 'base64' }
  ]
});

const id = generator.generateSemanticID('asset');

console.log('Generated ID:', id);
generator.configuration.compartments.forEach((compartment, index) => {
  console.log(`Compartment ${index + 1}:`, compartment);
});

