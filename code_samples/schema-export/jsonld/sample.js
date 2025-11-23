/**
 * Export JSON-LD schema for the `person` preset.
 *
 * Run with:
 *   node code_samples/schema-export/jsonld/sample.js
 */
import { buildSchemaForPreset } from '../../../index.js';

const { jsonld } = buildSchemaForPreset('person');

console.log('Schema IRI:', jsonld['@id']);
console.log('Domain class:', jsonld['sig:domainClass']);
console.log('Compartments:');
jsonld['sig:compartments'].forEach((compartment) => {
  console.log(` - ${compartment['schema:name']} (${compartment['sig:generationStrategy']})`);
});

