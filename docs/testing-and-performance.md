# Testing & Performance

Semantic ID Generator includes comprehensive test suites and regularly benchmarked performance targets. Use this page to navigate everything related to quality assurance.

## Running the test suite

```bash
npm test
```

### TypeScript-specific checks

```bash
npm run test:typescript
```

These commands cover unit tests (`mocha`), TypeScript compilation, and definition validation.

## Test coverage overview

| File | Focus |
| --- | --- |
| `01-semantic-id-generator.test.js` | Core ID generation |
| `02-check-configuration.test.js` | Configuration validation |
| `03-check-performances.test.js` | Performance smoke tests |
| `04-unicode-string-generation.test.js` | Unicode strategy correctness |
| `05-base64-strategy.test.js` | Base64 strategy coverage |
| `06-passphrase-strategy.test.js` | Passphrase caching + entropy |
| `07-random-strategy-coverage.test.js` | Strategy randomness guarantees |
| `08-domain-presets-and-schema.test.js` | Preset hydration + schema exports |
| `typescript-compilation.test.ts` | TS compilation for consumers |
| `typescript-definitions.test.ts` | Type definitions accuracy |

## Performance benchmarks

**General generation**
- 100,000 IDs (default config): ~11 seconds (~0.11 ms/id)

**Unicode strategy**
- 10,000 strings (length 10): ~565 ms
- 100 strings (length 1000): ~700 ms
- 1,000 strings (length 50): ~300 ms

**Strategy throughput**
- Visible characters, numbers, alphanumeric, hexadecimal, base64: consistently fast
- Passphrase: still sub-millisecond thanks to cached word lists
- All characters: slower by design due to full Unicode plane filtering

## Security guarantees

- All randomness uses Node.js `crypto.randomBytes()` / `crypto.randomInt()`
- Separators are excluded from every strategy, preventing malformed IDs
- Passphrase strategy sanitizes words that contain configured separators
- Dependencies (uuid, mocha, chai, TypeScript toolchain) are kept on current secure versions

## Dependency snapshot

| Type | Packages |
| --- | --- |
| Runtime | `uuid@^11.1.0` |
| Dev | `chai`, `mocha`, `ts-node`, `typescript`, `@types/*` |

Refer to `package.json` for exact versions.

## Performance tips

- Prefer presets + default strategies when possible (no per-call validation).
- Use `visible characters`, `numbers`, or `hexadecimal` strategies for hot paths—they avoid expensive Unicode filtering.
- Run `npm test` before publishing to ensure schema artifacts and preset metadata stay in sync.

