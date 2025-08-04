# Comprehensive Test Suite Documentation

This document provides a complete overview of all test cases implemented for the semantic-id-generator library, covering JavaScript functionality, TypeScript definitions, performance benchmarks, and comprehensive validation.

## 📋 Test Suite Overview

The semantic-id-generator library includes **59+ test cases** across **8 test files** that validate:

- ✅ **Core functionality** and ID generation
- ✅ **Configuration validation** and error handling
- ✅ **Performance benchmarking** and optimization
- ✅ **TypeScript definitions** and type safety
- ✅ **String generation strategies** (all 7 strategies)
- ✅ **Unicode string generation** optimization
- ✅ **Base64 strategy** implementation
- ✅ **Passphrase strategy** with multi-language support

## 🧪 Test Files

### 1. `test/01-semantic-id-generator.test.js`
**Purpose:** Basic functionality and ID generation tests.

**Test Cases:**
1. **ID Structure Validation**
   - Validates correct number of parts (2: conceptName + compartments)
   - Validates correct number of compartments (3 by default)
   - Validates each compartment has correct length

2. **Error Handling**
   - Tests invalid argument handling
   - Validates error messages for invalid inputs

3. **Default Configuration**
   - Tests default separator values (`|` and `-`)
   - Validates default compartment lengths (4, 8, 12)
   - Tests default generation strategy ("visible characters")

### 2. `test/02-check-configuration.test.js`
**Purpose:** Configuration validation and error handling tests.

**Test Cases:**
1. **Valid Configuration Tests**
   - Tests valid semantic ID generation from proper configuration
   - Validates configuration object structure

2. **Invalid Configuration Tests**
   - Tests invalid "name" value handling
   - Tests invalid "length" values (negative, zero, non-integer)
   - Tests invalid "generationStrategy" value handling
   - Validates error messages for each invalid case

3. **Configuration Structure**
   - Tests compartment array validation
   - Tests required property validation
   - Tests optional property handling

### 3. `test/03-check-performances.test.js`
**Purpose:** Performance benchmarking and optimization tests.

**Test Cases:**
1. **Bulk Generation Performance**
   - Tests generation of 100,000 IDs quickly
   - Measures performance in milliseconds
   - Validates performance meets requirements (< 20 seconds)

2. **Performance Metrics**
   - Tracks average time per ID generation
   - Monitors memory usage during bulk operations
   - Validates performance consistency

### 4. `test/04-unicode-string-generation.test.js`
**Purpose:** Unicode string generation optimization and security tests.

**Test Cases:**
1. **Unicode String Generation Function Tests**
   - Tests Unicode strings with correct length
   - Validates no separator characters in output
   - Tests different strings on multiple calls
   - Validates Unicode character handling
   - Tests error handling for invalid length
   - Tests different separator configurations

2. **Performance Tests**
   - **10,000 Unicode strings (10 chars each)**: ~377ms (0.0377ms per string)
   - **100 large Unicode strings (1000 chars each)**: ~322ms (3.22ms per string)
   - **1000 Unicode strings (50 chars each)**: ~188ms (0.188ms per string)

3. **Integration Tests**
   - Tests Unicode strategy in SemanticIDGenerator
   - Validates unique ID generation with Unicode strategy

### 5. `test/05-base64-strategy.test.js`
**Purpose:** Base64 string generation strategy testing.

**Test Cases:**
1. **Base64 String Generation Function Tests**
   - Tests Base64 strings with correct length
   - Validates no separator characters in output
   - Tests different strings on multiple calls
   - Validates only valid Base64 characters (A-Z, a-z, 0-9, +, /)
   - Tests error handling for invalid length
   - Tests different separator configurations

2. **Performance Tests**
   - **10,000 Base64 strings**: ~74ms (0.0075ms per string)
   - **100 large Base64 strings (1000 chars each)**: ~37ms (0.37ms per string)

3. **Integration Tests**
   - Tests Base64 strategy in SemanticIDGenerator
   - Validates unique ID generation with Base64 strategy
   - Tests mixed strategies including Base64

### 6. `test/06-passphrase-strategy.test.js`
**Purpose:** Passphrase string generation strategy testing with multi-language support.

**Test Cases:**
1. **Passphrase String Generation Function Tests**
   - Tests passphrase strings with correct length
   - Validates no separator characters in output
   - Tests different strings on multiple calls
   - Validates only lowercase letters in output
   - Tests error handling for invalid length
   - Tests different separator configurations
   - Tests readable word generation when possible
   - Tests all languages by default
   - Tests specific language configuration
   - Tests unknown language code handling

2. **Performance Tests**
   - **10,000 passphrase strings**: ~2170ms (0.217ms per string)
   - **50 large passphrase strings (500 chars each)**: ~27ms (0.55ms per string)

3. **Integration Tests**
   - Tests passphrase strategy in SemanticIDGenerator
   - Validates unique ID generation with passphrase strategy
   - Tests mixed strategies including passphrase
   - Tests human-readable passphrase generation
   - Tests language-specific passphrase generation

4. **Language Support Tests**
   - **English**: `windowpenguinzenithjunglecherr`
   - **French**: `foretcoucherreinejasminchuchot`
   - **Spanish**: `horizontesusurronebulosapulpoa`
   - **German**: `eisbergmondoaseapfeljasminadle`

### 7. `test/typescript-definitions.test.ts`
**Purpose:** TypeScript definitions and type safety validation.

**Test Cases:**
1. **Basic Type Checking**
   - Tests SemanticIDGenerator class type checking
   - Validates constructor and method signatures
   - Tests return type of `generateSemanticID()`

2. **Configuration Type Checking**
   - Tests `SemanticIDGeneratorConfig` interface
   - Validates all configuration properties
   - Tests compartment array handling

3. **Strategy and Language Type Checking**
   - Tests all `GenerationStrategy` types
   - Tests all `LanguageCode` types
   - Validates type union functionality

4. **Advanced Type Features**
   - Tests readonly configuration property
   - Tests error handling with TypeScript
   - Tests complex configurations
   - Tests type unions
   - Tests optional properties
   - Tests array types

### 8. `test/typescript-compilation.test.ts`
**Purpose:** TypeScript compilation and compile-time validation tests.

**Test Cases:**
1. **Type Usage Validation**
   - Tests correct type usage compilation
   - Validates configuration object structure
   - Tests type export functionality

2. **Strategy and Language Validation**
   - Tests all valid generation strategies
   - Tests all valid language codes
   - Validates type safety for each

3. **Structure and Method Validation**
   - Tests compartment structure validation
   - Tests readonly configuration property
   - Tests method signature validation
   - Tests constructor overload validation

4. **Complex Scenarios**
   - Tests complex type scenarios
   - Tests type safety for error handling
   - Validates advanced type usage

## 🚀 Running Tests

### All Tests
```bash
# Run all JavaScript and TypeScript tests
npm test

# Run all tests with TypeScript support
npm test && npm run test:typescript
```

### Individual Test Categories
```bash
# Core functionality tests
npx mocha test/01-semantic-id-generator.test.js

# Configuration validation tests
npx mocha test/02-check-configuration.test.js

# Performance tests
npx mocha test/03-check-performances.test.js

# Unicode optimization tests
npx mocha test/04-unicode-string-generation.test.js

# Base64 strategy tests
npx mocha test/05-base64-strategy.test.js

# Passphrase strategy tests
npx mocha test/06-passphrase-strategy.test.js

# TypeScript definition tests
npx mocha test/typescript-definitions.test.ts --require ts-node/register

# TypeScript compilation tests
npx mocha test/typescript-compilation.test.ts --require ts-node/register
```

### TypeScript Tests Only
```bash
# Run all TypeScript tests
npm run test:typescript

# Type checking
npm run type-check
```

## 📊 Test Coverage

### Functionality Coverage
- ✅ **Core ID Generation**
  - Default configuration handling
  - Custom configuration support
  - Error handling and validation

- ✅ **String Generation Strategies**
  - All characters (Unicode)
  - Visible characters (ASCII)
  - Numbers (0-9)
  - Alphanumeric (A-Z, a-z, 0-9)
  - Hexadecimal (0-9, a-f)
  - Base64 (A-Z, a-z, 0-9, +, /)
  - Passphrase (multi-language words)

- ✅ **Configuration Management**
  - Separator customization
  - Compartment configuration
  - Strategy assignment
  - Language code support

- ✅ **Error Handling**
  - Invalid configuration detection
  - Invalid input validation
  - Meaningful error messages
  - Graceful failure handling

### Performance Coverage
- ✅ **Bulk Generation Performance**
  - 100,000 IDs generation: ~10-16 seconds
  - Average time per ID: ~0.1-0.17ms

- ✅ **Strategy Performance Benchmarks**
  - **Base64**: Fastest (0.0075ms per string)
  - **Visible characters**: Very fast (0.0377ms per string)
  - **Numbers/Alphanumeric/Hexadecimal**: Fast
  - **Passphrase**: Moderate (0.217ms per string)
  - **Unicode**: Slower due to complexity (0.0377ms per string)

### TypeScript Coverage
- ✅ **Type Definitions**
  - SemanticIDGenerator class
  - SemanticIDGeneratorConfig interface
  - Compartment interface
  - GenerationStrategy type union
  - LanguageCode type union
  - All internal interfaces

- ✅ **Type Safety**
  - Constructor overloads
  - Method signatures
  - Property access
  - Error handling
  - Type unions
  - Optional properties
  - Array types

### Security Coverage
- ✅ **Cryptographic Security**
  - Uses `crypto.randomBytes()` and `crypto.randomInt()`
  - High entropy and unpredictability
  - Suitable for production environments

- ✅ **Input Validation**
  - Length validation
  - Type validation
  - Strategy validation
  - Language code validation

## 🎯 Test Results

**Current Status:** ✅ **59+ passing tests**

### JavaScript Tests (48 tests)
```
01 | SemanticIDGenerator | Test Main
  ✔ should generate an ID with the correct number of parts (2)
  ✔ should generate an ID with the correct number of compartments (3)
  ✔ should generate an ID where each compartment has correct length
  ✔ should throw an error when provided with invalid arguments

02 | Configuration Validation
  ✔ should generate a valid semantic id from a valid configuration
  ✔ should throw an error when a configuration contains invalid "name" value
  ✔ should throw an error when a configuration contains invalid "length" values
  ✔ should throw an error when a configuration contains invalid "generationStrategy" value

03 | Performance Tests
  ✔ should generate 100,000 IDs quickly (~10-16 seconds)

04 | Unicode String Generation
  ✔ should generate Unicode strings with correct length
  ✔ should not contain separator characters
  ✔ should generate different strings on multiple calls
  ✔ should handle Unicode characters correctly
  ✔ should throw error for invalid length
  ✔ should work with different separator configurations
  ✔ should generate 10,000 Unicode strings efficiently (~377ms)
  ✔ should handle large Unicode strings efficiently (~322ms)
  ✔ should perform better than Math.random() implementation (~188ms)
  ✔ should work correctly in SemanticIDGenerator with Unicode strategy
  ✔ should generate unique IDs with Unicode strategy

05 | Base64 Generation Strategy
  ✔ should generate Base64 strings with correct length
  ✔ should not contain separator characters
  ✔ should generate different strings on multiple calls
  ✔ should contain only valid Base64 characters
  ✔ should throw error for invalid length
  ✔ should work with different separator configurations
  ✔ should generate 10,000 Base64 strings efficiently (~74ms)
  ✔ should handle large Base64 strings efficiently (~37ms)
  ✔ should work correctly in SemanticIDGenerator with Base64 strategy
  ✔ should generate unique IDs with Base64 strategy
  ✔ should generate semantic IDs with mixed strategies including Base64

06 | Passphrase Generation Strategy
  ✔ should generate passphrase strings with correct length
  ✔ should not contain separator characters
  ✔ should generate different strings on multiple calls
  ✔ should contain only lowercase letters
  ✔ should throw error for invalid length
  ✔ should work with different separator configurations
  ✔ should generate readable words when possible
  ✔ should use all languages by default
  ✔ should support specific language configuration
  ✔ should handle unknown language codes gracefully
  ✔ should generate 10,000 passphrase strings efficiently (~2170ms)
  ✔ should handle large passphrase strings efficiently (~27ms)
  ✔ should work correctly in SemanticIDGenerator with Passphrase strategy
  ✔ should generate unique IDs with Passphrase strategy
  ✔ should generate semantic IDs with mixed strategies including Passphrase
  ✔ should generate human-readable passphrases
  ✔ should generate passphrases with language configuration
```

### TypeScript Tests (21 tests)
```
TypeScript Definitions
  ✔ should provide proper type checking for SemanticIDGenerator
  ✔ should provide proper type checking for configuration
  ✔ should provide proper type checking for compartments
  ✔ should provide proper type checking for generation strategies
  ✔ should provide proper type checking for language codes
  ✔ should provide proper type checking for readonly configuration
  ✔ should provide proper type checking for error handling
  ✔ should provide proper type checking for complex configurations
  ✔ should provide proper type checking for type unions
  ✔ should provide proper type checking for optional properties
  ✔ should provide proper type checking for array types

TypeScript Compilation Tests
  ✔ should validate correct type usage
  ✔ should validate generation strategy types
  ✔ should validate language code types
  ✔ should validate compartment structure
  ✔ should validate readonly configuration property
  ✔ should validate method signatures
  ✔ should validate constructor overloads
  ✔ should validate type exports
  ✔ should validate complex type scenarios
  ✔ should validate type safety for error handling
```

## 🔧 Test Configuration

### Dependencies
- **Mocha**: `^10.2.0` (JavaScript test runner)
- **Chai**: `^4.3.7` (Assertion library)
- **TypeScript**: `^5.0.0` (TypeScript compiler)
- **ts-node**: `^10.9.0` (TypeScript execution)
- **@types/node**: `^20.0.0` (Node.js types)
- **@types/mocha**: `^10.0.10` (Mocha types)
- **@types/chai**: `^5.2.2` (Chai types)

### Test Scripts
```json
{
  "scripts": {
    "test": "mocha",
    "test:typescript": "mocha test/typescript-*.test.ts --require ts-node/register",
    "type-check": "tsc --noEmit"
  }
}
```

## 📝 Test Maintenance

### Adding New Tests
1. **JavaScript Tests**: Add to appropriate `test/*.test.js` file
2. **TypeScript Tests**: Add to appropriate `test/typescript-*.test.ts` file
3. **Follow naming convention**: `should [description]`
4. **Include proper assertions**: Use Chai's `expect()` syntax
5. **Test both positive and negative cases**
6. **Run tests**: `npm test && npm run test:typescript`

### Performance Testing
1. **Benchmark new features** against existing performance
2. **Monitor memory usage** during bulk operations
3. **Validate performance consistency** across runs
4. **Update performance documentation** with new benchmarks

### TypeScript Testing
1. **Add type definitions** for new features
2. **Create corresponding test cases** for type safety
3. **Run type checking**: `npm run type-check`
4. **Validate IntelliSense support** in IDEs

## 🎉 Benefits

The comprehensive test suite provides:

- **🔍 Complete functionality validation**
- **⚡ Performance benchmarking**
- **🛡️ Type safety guarantees**
- **🔧 Error prevention**
- **📚 Comprehensive documentation**
- **🚀 Improved developer experience**
- **🐛 Reduced runtime errors**
- **🔄 Easy refactoring support**

The test suite ensures that the semantic-id-generator library is **production-ready**, **well-documented**, and **highly reliable** for all users. 