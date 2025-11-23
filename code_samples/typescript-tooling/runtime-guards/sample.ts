/**
 * Runtime guards for user-provided strategy + language values.
 *
 * Run with:
 *   npx ts-node code_samples/typescript-tooling/runtime-guards/sample.ts
 */
import SemanticIDGenerator, {
  type GenerationStrategy,
  type LanguageCode
} from '../../../index.js';

function isGenerationStrategy(value: string): value is GenerationStrategy {
  return [
    'all characters',
    'visible characters',
    'numbers',
    'alphanumeric',
    'hexadecimal',
    'base64',
    'passphrase'
  ].includes(value as GenerationStrategy);
}

function isLanguageCode(value: string): value is LanguageCode {
  return ['eng', 'fra', 'spa', 'ita', 'deu', 'nld', 'wol'].includes(value as LanguageCode);
}

const userStrategy = 'base64';
const userLanguage = 'fra';

if (!isGenerationStrategy(userStrategy) || !isLanguageCode(userLanguage)) {
  throw new Error('Unsupported strategy or language');
}

const generator = new SemanticIDGenerator({
  languageCode: userLanguage,
  compartments: [{ name: 'payload', length: 18, generationStrategy: userStrategy }]
});

console.log(generator.generateSemanticID('guarded'));

