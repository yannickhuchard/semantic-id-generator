/**
 * Basic ID generation using the library defaults.
 *
 * Run with:
 *   node code_samples/basic-id-generation/default-config/sample.js
 */
import SemanticIDGenerator from '../../../index.js';

const generator = new SemanticIDGenerator();
const id = generator.generateSemanticID('person');

console.log('Generated ID:', id);
console.log('Active compartments:', generator.configuration.compartments);

