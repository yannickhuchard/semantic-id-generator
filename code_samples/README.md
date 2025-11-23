# Code Samples

Each folder in `code_samples/` focuses on a single feature of the Semantic ID Generator and contains **one runnable variation**. Every sample is intentionally small, documented, and executable directly from the repository root.

> Replace the relative `../../../index.js` import with `semantic-id-generator` when you consume these snippets inside your own project.

| Feature | Variation | Path | Run command |
| --- | --- | --- | --- |
| Basic ID generation | Default configuration | `code_samples/basic-id-generation/default-config/sample.js` | `node code_samples/basic-id-generation/default-config/sample.js` |
| Basic ID generation | Custom compartments & separators | `code_samples/basic-id-generation/custom-configuration/sample.js` | `node code_samples/basic-id-generation/custom-configuration/sample.js` |
| String strategies | Base64 compartment | `code_samples/string-strategies/base64-compartment/sample.js` | `node code_samples/string-strategies/base64-compartment/sample.js` |
| String strategies | Passphrase with language scoping | `code_samples/string-strategies/passphrase-language/sample.js` | `node code_samples/string-strategies/passphrase-language/sample.js` |
| Domain presets | Contract preset generation | `code_samples/domain-presets/generate-contract-id/sample.js` | `node code_samples/domain-presets/generate-contract-id/sample.js` |
| Domain presets | Inspect preset metadata | `code_samples/domain-presets/list-metadata/sample.js` | `node code_samples/domain-presets/list-metadata/sample.js` |
| Semantic ID inspector | Validate & explain IDs | `code_samples/semantic-id-inspector/basic-validation/sample.js` | `node code_samples/semantic-id-inspector/basic-validation/sample.js` |
| Schema export | JSON-LD artifact | `code_samples/schema-export/jsonld/sample.js` | `node code_samples/schema-export/jsonld/sample.js` |
| Schema export | OWL artifact | `code_samples/schema-export/owl/sample.js` | `node code_samples/schema-export/owl/sample.js` |
| TypeScript tooling | Builder pattern | `code_samples/typescript-tooling/builder-pattern/sample.ts` | `node --import ./scripts/register-ts-node.mjs code_samples/typescript-tooling/builder-pattern/sample.ts` |
| TypeScript tooling | Runtime guards | `code_samples/typescript-tooling/runtime-guards/sample.ts` | `node --import ./scripts/register-ts-node.mjs code_samples/typescript-tooling/runtime-guards/sample.ts` |

Feel free to copy any folder as a starting point for your own automation scripts, CLIs, or test harnesses.

