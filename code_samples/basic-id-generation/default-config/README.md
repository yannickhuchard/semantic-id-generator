# Basic ID Generation · Default Configuration

This sample generates a semantic identifier using the library defaults:

- `dataConceptSeparator`: `|`
- `compartmentSeparator`: `-`
- Three visible-character compartments (`4`, `8`, `12` chars)

## Run

```bash
node code_samples/basic-id-generation/default-config/sample.js
```

## What it demonstrates

- Instantiating `SemanticIDGenerator` with zero configuration.
- Reading the resolved runtime configuration to understand the active compartments.

