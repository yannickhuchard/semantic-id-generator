/**
 * Generate an ID from the built-in `contract` preset.
 *
 * Run with:
 *   node code_samples/domain-presets/generate-contract-id/sample.js
 */
import SemanticIDGenerator from '../../../index.js';

const generator = new SemanticIDGenerator({ preset: 'contract' });
const id = generator.generateSemanticID('contract');

console.log('Contract ID:', id);
console.log('Preset name:', generator.configuration.preset);

