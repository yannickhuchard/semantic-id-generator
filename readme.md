# Semantic ID Generator - NPM Package

![GitHub](https://img.shields.io/github/license/yannickhuchard/semantic-id-generator)
![NPM version](https://img.shields.io/npm/v/semantic-id-generator)
![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)

![Logo](/logo/semantic-id-generator_logo_192x192.png) 

## Table of Contents
- [Semantic ID Generator - NPM Package](#semantic-id-generator---npm-package)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
    - [What is a Semantic Identifier?](#what-is-a-semantic-identifier)
    - [Examples](#examples)
  - [String Generation Strategies](#string-generation-strategies)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
  - [Usage](#usage)
    - [Basic Usage](#basic-usage)
    - [Advanced Usage](#advanced-usage)
    - [Default Values](#default-values)
  - [Run unit tests](#run-unit-tests)
  - [License](#license)
  - [About the Author](#about-the-author)

## Introduction
Semantic ID Generator is a Node.js package designed to generate structured and meaningful unique identifiers, named "Semantic ID". These identifiers are composed of different "compartments" each having a specific "semantic meaning" and generation strategy.

**Latest Updates (v1.1.2):**
- ✅ **Full-plane Unicode IDs**: “All characters” strategy now emits printable code points across the entire Unicode range while guaranteeing the configured compartment length.
- ✅ **Safer Passphrases**: Word lists are cached once and any word containing your separators is skipped automatically to avoid malformed IDs.
- ✅ **Cleaner TypeScript Tooling**: The `ts-node` loader now runs via a dedicated bootstrap script, eliminating experimental warnings in CI.
- ✅ **Expanded Test Coverage**: New suites verify numeric/alphanumeric entropy, Unicode behavior, passphrase caching, and performance thresholds.

### What is a Semantic Identifier?
A Semantic ID is an identifier that implements following AMASE data architecture principles:
- Unique
- Recognizable by humans and artificial intelligence
- Semantically coherent according to semantic rules defined by the data architects/engineers
- Consistent across all data spaces, including historical changes
- Generated from a configurable Factory

A semantic id follows the pattern:
```
{date concept name}{name separator}{compartment 1}{compartment separator}{compartment 2}{compartment separator}...{compartment N}
```

### Examples
Here a few examples of generated semantic identifiers:
- A **person ID**: `person|AbCd-12345678-9ABCDEF0123456789ABCDEF0`
- An **organization ID**: `organization|7890-MNO56789-123456789ABCDEF01234`
- A **multicurrency account**: `multicurrency_account|XYZ2-87654321-ABCD5678901234567890`
- A **device ID**: `device_id|A1B2-135792468-EDCBA098765432109876`


## String Generation Strategies

Semantic ID Generator uses different string generation strategies to generate each compartment of the semantic ID. Here are the currently available strategies:

- **all characters**: This strategy emits printable characters from the full Unicode plane (including emoji) while respecting the requested compartment length by skipping any code point that would overflow the remaining space.
- **visible characters**: This strategy generates a string that only includes visible Unicode characters.
- **numbers**: This strategy generates a string that only includes numeric characters (0-9).
- **alphanumeric**: This strategy generates a string that includes both alphabetic (A-Z, a-z) and numeric (0-9) characters.
- **hexadecimal**: This strategy generates a string that includes hexadecimal characters (0-9, a-f).
- **base64**: This strategy generates a string that includes Base64 characters (A-Z, a-z, 0-9, +, /).
- **passphrase**: This strategy generates a string using common words from multiple languages (English, French, Spanish, Italian, German, Dutch, Wolof), creating human-readable passphrases and automatically skips any word that contains your configured separators.

These strategies can be assigned to each compartment in the Semantic ID Generator configuration. This allows you to customize the generation of each part of the semantic ID according to your requirements.


## Installation

### Prerequisites

Before you can use the Semantic ID Generator, you must have certain software installed on your computer:

- **Node.js**: This is the JavaScript runtime in which the Semantic ID Generator runs. You can download it from https://nodejs.org.

- **NPM**: This is the package manager for Node.js. It is included with the Node.js installation.

After installing Node.js and NPM, you need to install the dependencies of the Semantic ID Generator:
- **uuid**: This is an NPM package that allows you to generate UUIDs. You can install it with the following command:

```shell
npm install uuid
```

Then install the Semantic ID Generator library

```bash
npm install semantic-id-generator
```

### ES Module Support

This package is now a pure ES module. To use it in your project:

**For ES Module projects (recommended):**
```javascript
import SemanticIDGenerator from 'semantic-id-generator';
```

**For CommonJS projects:**
```javascript
const SemanticIDGenerator = await import('semantic-id-generator');
const generator = new SemanticIDGenerator.default();
```

### TypeScript Support

The library includes full TypeScript support with comprehensive type definitions. If you're using TypeScript, you'll get:

- **Full IntelliSense support** in your IDE
- **Type checking** for all configuration options
- **Autocomplete** for generation strategies and language codes
- **Compile-time error detection**

```typescript
import SemanticIDGenerator, { 
  SemanticIDGeneratorConfig, 
  Compartment, 
  GenerationStrategy, 
  LanguageCode 
} from 'semantic-id-generator';

// Type-safe configuration
const config: SemanticIDGeneratorConfig = {
  dataConceptSeparator: '|',
  compartmentSeparator: '-',
  compartments: [
    { name: 'prefix', length: 8, generationStrategy: 'visible characters' },
    { name: 'base64_part', length: 24, generationStrategy: 'base64' },
    { name: 'suffix', length: 12, generationStrategy: 'hexadecimal' }
  ]
};

const generator = new SemanticIDGenerator(config);
const id = generator.generateSemanticID('document');
```





## Usage

### Basic Usage

```javascript
import SemanticIDGenerator from 'semantic-id-generator';
const generator = new SemanticIDGenerator();
const id = generator.generateSemanticID('person');
console.log(id); // Outputs looks like 'person|abcd-abcdefgh-abcdefghijkl'
```

### Advanced Usage

```javascript
import SemanticIDGenerator from 'semantic-id-generator';

const config = { 
    dataConceptSeparator: '|', 
    compartmentSeparator: '-', 
    compartments: [
        { name: 'part1', length: 10, generationStrategy: "visible characters"},
        { name: 'part2', length: 10, generationStrategy: "numbers"},
        { name: 'part3', length: 32, generationStrategy: "hexadecimal"}
    ] 
};

const generator = new SemanticIDGenerator(config);
const id = generator.generateSemanticID('person');
console.log(id);
```

**Example with Base64 strategy:**

```javascript
import SemanticIDGenerator from 'semantic-id-generator';

const config = { 
    dataConceptSeparator: '|', 
    compartmentSeparator: '-', 
    compartments: [
        { name: 'prefix', length: 8, generationStrategy: "visible characters"},
        { name: 'base64_part', length: 24, generationStrategy: "base64"},
        { name: 'suffix', length: 12, generationStrategy: "hexadecimal"}
    ] 
};

const generator = new SemanticIDGenerator(config);
const id = generator.generateSemanticID('document');
console.log(id); // Example: 'document|Kj8mNx2-AbCdEfGhIjKlMnOpQrStUv-1a2b3c4d5e6f'
```

**Example with Passphrase strategy:**

```javascript
import SemanticIDGenerator from 'semantic-id-generator';

const config = { 
    dataConceptSeparator: '|', 
    compartmentSeparator: '-', 
    compartments: [
        { name: 'prefix', length: 8, generationStrategy: "visible characters"},
        { name: 'passphrase_part', length: 25, generationStrategy: "passphrase"},
        { name: 'suffix', length: 12, generationStrategy: "hexadecimal"}
    ] 
};

const generator = new SemanticIDGenerator(config);
const id = generator.generateSemanticID('user_session');
console.log(id); // Example: 'user_session|Kj8mNx2-applebananacherrydragon-1a2b3c4d5e6f'

**Example with language configuration:**

```javascript
import SemanticIDGenerator from 'semantic-id-generator';

// Default behavior: uses all languages
const defaultConfig = { 
    dataConceptSeparator: '|', 
    compartmentSeparator: '-', 
    compartments: [
        { name: 'passphrase', length: 25, generationStrategy: "passphrase"}
    ] 
};

const defaultGenerator = new SemanticIDGenerator(defaultConfig);
const mixedId = defaultGenerator.generateSemanticID('session');
console.log(mixedId); // Example: 'session|applepommemanzanaapfel'

// Specific language configuration
const englishConfig = { 
    dataConceptSeparator: '|', 
    compartmentSeparator: '-', 
    languageCode: 'eng',
    compartments: [
        { name: 'passphrase', length: 25, generationStrategy: "passphrase"}
    ] 
};

const frenchConfig = { 
    dataConceptSeparator: '|', 
    compartmentSeparator: '-', 
    languageCode: 'fra',
    compartments: [
        { name: 'passphrase', length: 25, generationStrategy: "passphrase"}
    ] 
};

const englishGenerator = new SemanticIDGenerator(englishConfig);
const frenchGenerator = new SemanticIDGenerator(frenchConfig);

const englishId = englishGenerator.generateSemanticID('session'); // English only
const frenchId = frenchGenerator.generateSemanticID('session');   // French only

console.log(englishId); // Example: 'session|applebananacherrydragon'
console.log(frenchId);  // Example: 'session|pommebananejardinmaison'
```

**Supported Languages:**
- `eng` - English
- `fra` - French
- `spa` - Spanish
- `ita` - Italian
- `deu` - German
- `nld` - Dutch
- `wol` - Wolof

**Note:** By default, the passphrase strategy uses words from all languages. To restrict to a specific language, add `languageCode` to the configuration.
```

### TypeScript Examples

For comprehensive TypeScript examples, see the `examples/typescript-example.ts` file. Here are some highlights:

**Type-safe configuration building:**
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
    if (!this.config.compartments) {
      this.config.compartments = [];
    }
    this.config.compartments.push(compartment);
    return this;
  }

  setLanguageCode(languageCode: LanguageCode) {
    this.config.languageCode = languageCode;
    return this;
  }

  build() {
    return { ...this.config };
  }
}

const config = new ConfigurationBuilder()
  .setDataConceptSeparator('|')
  .setCompartmentSeparator('-')
  .addCompartment({ name: 'prefix', length: 6, generationStrategy: 'visible characters' })
  .addCompartment({ name: 'uuid', length: 32, generationStrategy: 'hexadecimal' })
  .setLanguageCode('eng')
  .build();
```

**Type validation utilities:**
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

// Validate generation strategies
console.log(validateStrategy('base64')); // true
console.log(validateStrategy('invalid' as GenerationStrategy)); // false

// Validate language codes
console.log(validateLanguageCode('eng')); // true
console.log(validateLanguageCode('invalid' as LanguageCode)); // false
```

**Error handling with TypeScript:**
```typescript
try {
  const generator = new SemanticIDGenerator();
  const id = generator.generateSemanticID('test');
} catch (error) {
  // TypeScript knows this is an Error
  console.error((error as Error).message);
}
```

### Default Values

If you do not specify certain configuration options when creating a new Semantic ID Generator, the library uses the following default values:

- **dataConceptSeparator**: `|`. It separates the data concept name from the rest of the semantic ID.

- **compartmentSeparator**: `-`. It separates the different compartments within the semantic ID.

- **compartments**: By default, the Semantic ID Generator uses three compartments. The compartments' names are 'part1', 'part2', and 'part3', and their lengths are 4, 8, and 12 characters, respectively.

- **generationStrategy**: "visible characters". This strategy generates strings using visible Unicode characters (excluding separators).




## Performance

The Semantic ID Generator is designed for high performance and security. Here are the performance benchmarks from our test suite:

### Performance Benchmarks

**General Performance:**
- **100,000 IDs generation**: ~11 seconds (0.11ms per ID)
- **Default configuration**: 3 compartments with visible characters strategy

**Unicode String Generation:**
- **10,000 Unicode strings (10 chars each)**: ~565ms (0.056ms per string)
- **100 large Unicode strings (1000 chars each)**: ~700ms (7ms per string)
- **1000 Unicode strings (50 chars each)**: ~300ms (0.3ms per string)

**String Generation Strategies Performance:**
- **Visible characters**: Fastest, uses ASCII range (0x0020-0x007E)
- **Numbers**: Very fast, uses only digits (0-9)
- **Alphanumeric**: Fast, uses A-Z, a-z, 0-9
- **Hexadecimal**: Fast, uses 0-9, a-f
- **Base64**: Fast, uses A-Z, a-z, 0-9, +, /
- **Passphrase**: Fast, uses common English words (a-z only)
- **All characters**: Slower due to Unicode complexity, uses full Unicode range

### Security Features

All string generation uses cryptographically secure random number generation:
- Uses Node.js `crypto.randomBytes()` and `crypto.randomInt()`
- Provides high entropy and unpredictability
- Suitable for production environments requiring security
- **Latest security updates**: All dependencies updated to latest secure versions (August 2025)

### Test Coverage

The library includes comprehensive test coverage:

**Test Suites:**
- **01-semantic-id-generator.test.js**: Basic functionality and ID generation
- **02-check-configuration.test.js**: Configuration validation and error handling
- **03-check-performances.test.js**: Performance benchmarking
- **04-unicode-string-generation.test.js**: Unicode string generation optimization
- **05-base64-strategy.test.js**: Base64 string generation strategy testing
- **06-passphrase-strategy.test.js**: Passphrase string generation strategy testing
- **typescript-compilation.test.ts**: TypeScript compilation verification
- **typescript-definitions.test.ts**: TypeScript definitions testing

**Test Categories:**
- Functionality tests (ID generation, validation)
- Configuration tests (error handling, edge cases)
- Performance tests (speed benchmarks)
- Unicode optimization tests (security and efficiency)
- TypeScript compilation and type checking tests

**Total Tests:** 48+ passing tests covering all aspects of the library.

### Current Dependencies

**Production Dependencies:**
- `uuid`: ^11.1.0 (Latest secure version)

**Development Dependencies:**
- `@types/chai`: ^5.2.2
- `@types/mocha`: ^10.0.10
- `@types/node`: ^24.2.0
- `chai`: ^5.2.1
- `mocha`: ^11.7.1
- `ts-node`: ^10.9.2
- `typescript`: ^5.9.2

All dependencies are updated to their latest secure versions as of August 2025.

## Run unit tests
Run from your command line interface (Bash, Ksh, Windows Terminal, etc.):

```bash
npm test
```

For TypeScript-specific tests:
```bash
npm run test:typescript
```


## License

This project is licensed under [MIT License](LICENSE).

## About the Author

Semantic ID Generator is created by Yannick Huchard - CTO. For more information, visit: 
- [yannickhuchard.com](https://yannickhuchard.com) | [Podcast](https://podcasters.spotify.com/pod/show/yannick-huchard) | [Medium](https://yannick-huchard.medium.com/) | [Youtube](https://www.youtube.com/@YannickHuchard)
- More about AMASE, enterprise engineering/architecture system for businesses and startups: [amase.io](https://amase.io).
