# Usage & Configuration Guide

This guide collects all configuration patterns, code samples, and TypeScript helpers that previously lived in the root README.

## Basic usage

```javascript
import SemanticIDGenerator from 'semantic-id-generator';

const generator = new SemanticIDGenerator();
const id = generator.generateSemanticID('person');
console.log(id); // person|abcd-abcdefgh-abcdefghijkl
```

## Advanced configuration

```javascript
import SemanticIDGenerator from 'semantic-id-generator';

const config = {
  dataConceptSeparator: '|',
  compartmentSeparator: '-',
  compartments: [
    { name: 'prefix', length: 10, generationStrategy: 'visible characters' },
    { name: 'numbers', length: 10, generationStrategy: 'numbers' },
    { name: 'hex', length: 32, generationStrategy: 'hexadecimal' }
  ]
};

const generator = new SemanticIDGenerator(config);
console.log(generator.generateSemanticID('person'));
```

### Base64 strategy example

```javascript
const config = {
  dataConceptSeparator: '|',
  compartmentSeparator: '-',
  compartments: [
    { name: 'prefix', length: 8, generationStrategy: 'visible characters' },
    { name: 'base64_part', length: 24, generationStrategy: 'base64' },
    { name: 'suffix', length: 12, generationStrategy: 'hexadecimal' }
  ]
};

const generator = new SemanticIDGenerator(config);
console.log(generator.generateSemanticID('document'));
```

### Passphrase strategy example

```javascript
const config = {
  dataConceptSeparator: '|',
  compartmentSeparator: '-',
  compartments: [
    { name: 'prefix', length: 8, generationStrategy: 'visible characters' },
    { name: 'passphrase_part', length: 25, generationStrategy: 'passphrase' },
    { name: 'suffix', length: 12, generationStrategy: 'hexadecimal' }
  ]
};

const generator = new SemanticIDGenerator(config);
console.log(generator.generateSemanticID('user_session'));
```

#### Language-specific passphrase IDs

```javascript
const englishConfig = {
  dataConceptSeparator: '|',
  compartmentSeparator: '-',
  languageCode: 'eng',
  compartments: [{ name: 'passphrase', length: 25, generationStrategy: 'passphrase' }]
};

const frenchConfig = { ...englishConfig, languageCode: 'fra' };

console.log(new SemanticIDGenerator(englishConfig).generateSemanticID('session'));
console.log(new SemanticIDGenerator(frenchConfig).generateSemanticID('session'));
```

Supported language codes: `eng`, `fra`, `spa`, `ita`, `deu`, `nld`, `wol`.  
If omitted, the passphrase strategy pulls from all word lists.

## TypeScript helpers

```typescript
class ConfigurationBuilder {
  private config: SemanticIDGeneratorConfig = {};

  setDataConceptSeparator(separator: string) {
    this.config.dataConceptSeparator = separator;
    return this;
  }

  setCompartmentSeparator(separator: string) {
    this.config.compartmentSeparator = separator;
    return this;
  }

  addCompartment(compartment: Compartment) {
    this.config.compartments = this.config.compartments ?? [];
    this.config.compartments.push(compartment);
    return this;
  }

  setLanguageCode(code: LanguageCode) {
    this.config.languageCode = code;
    return this;
  }

  build() {
    return { ...this.config };
  }
}
```

### Validation utilities

```typescript
function validateStrategy(strategy: GenerationStrategy): boolean {
  const allowed: GenerationStrategy[] = [
    'all characters',
    'visible characters',
    'numbers',
    'alphanumeric',
    'hexadecimal',
    'base64',
    'passphrase',
  ];
  return allowed.includes(strategy);
}

function validateLanguageCode(code: LanguageCode): boolean {
  const allowed: LanguageCode[] = ['eng', 'fra', 'spa', 'ita', 'deu', 'nld', 'wol'];
  return allowed.includes(code);
}
```

### Error handling example

```typescript
try {
  const generator = new SemanticIDGenerator();
  const id = generator.generateSemanticID('test');
} catch (error) {
  console.error((error as Error).message);
}
```

## Default values

- `dataConceptSeparator`: `|`
- `compartmentSeparator`: `-`
- Default compartments: `part1` (4 visible chars), `part2` (8 visible chars), `part3` (12 visible chars)
- Default strategy: `"visible characters"`

## String generation strategies

- **all characters** – printable Unicode plane, skips separators
- **visible characters** – ASCII range 0x20-0x7E
- **numbers** – digits 0-9
- **alphanumeric** – letters (case-sensitive) + digits
- **hexadecimal** – `0-9a-f`
- **base64** – `A-Za-z0-9+/`
- **passphrase** – concatenates safe words from multilingual lists

