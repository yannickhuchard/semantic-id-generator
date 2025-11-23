/**
 * Export OWL schema for the `dataset` preset.
 *
 * Run with:
 *   node code_samples/schema-export/owl/sample.js
 */
import { exportSchema } from '../../../index.js';

const owl = exportSchema('dataset', 'owl');

console.log(owl.split('\n').slice(0, 12).join('\n'));
console.log('...\n(Truncated for brevity)');

