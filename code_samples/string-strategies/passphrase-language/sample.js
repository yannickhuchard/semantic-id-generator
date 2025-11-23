/**
 * Passphrase strategy with and without a language code.
 *
 * Run with:
 *   node code_samples/string-strategies/passphrase-language/sample.js
 */
import SemanticIDGenerator from '../../../index.js';

const multilingual = new SemanticIDGenerator({
  compartments: [{ name: 'passphrase', length: 25, generationStrategy: 'passphrase' }]
});

const englishOnly = new SemanticIDGenerator({
  languageCode: 'eng',
  compartments: [{ name: 'passphrase', length: 25, generationStrategy: 'passphrase' }]
});

console.log('Multilingual session ID:', multilingual.generateSemanticID('session'));
console.log('English-only session ID:', englishOnly.generateSemanticID('session'));

