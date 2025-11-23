/**
 * Inspect domain preset metadata without generating IDs.
 *
 * Run with:
 *   node code_samples/domain-presets/list-metadata/sample.js
 */
import { getDomainPreset, getPresetMetadata, listDomainPresets } from '../../../index.js';

console.log('Available presets:', listDomainPresets());

const presetKey = 'device';
const config = getDomainPreset(presetKey);
const metadata = getPresetMetadata(presetKey);

console.log(`Metadata for ${presetKey}:`, metadata);
console.log('Compartments:');
config.compartments.forEach((compartment, index) => {
  console.log(`  ${index + 1}.`, compartment);
});

