# TypeScript Tooling · Runtime Guards

Lightweight example of validating strategies and language codes at runtime while still benefiting from TypeScript enums.

## Run

```bash
node --import ./scripts/register-ts-node.mjs code_samples/typescript-tooling/runtime-guards/sample.ts
```

## What it demonstrates

- Type-safe helper functions that narrow `GenerationStrategy` / `LanguageCode`.
- Guarding user input before constructing the generator.

