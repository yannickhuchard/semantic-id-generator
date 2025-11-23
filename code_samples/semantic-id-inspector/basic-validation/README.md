# Semantic ID Inspector – Basic Validation

This sample shows how to:

1. Generate an identifier with the `person` preset.
2. Run `SemanticIDInspector` without any configuration (auto-detects the preset).
3. Tamper with one compartment to see how the inspector surfaces issues.

## Run it

```bash
node code_samples/semantic-id-inspector/basic-validation/sample.js
```

You should see:

- A valid report with detected preset + metadata.
- A tampered report where the inspector flags the compartment that now contains the reserved `|` separator.


