/**
 * TypeScript example for semantic-id-generator
 * 
 * This example demonstrates how to use the library with full TypeScript support
 * 
 * @created by Yannick Huchard
 * @link https://yannickhuchard.com
 */

import SemanticIDGenerator from '../index';
import { 
  SemanticIDGeneratorConfig, 
  Compartment, 
  GenerationStrategy, 
  LanguageCode 
} from '../types';

// Example 1: Basic usage with default configuration
function basicExample(): void {
  console.log('=== Basic Example ===');
  
  const generator = new SemanticIDGenerator();
  const id = generator.generateSemanticID('person');
  
  console.log('Generated ID:', id);
  console.log('Configuration:', generator.configuration);
}

// Example 2: Custom configuration with type safety
function customConfigurationExample(): void {
  console.log('\n=== Custom Configuration Example ===');
  
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
  
  console.log('Generated ID:', id);
}

// Example 3: Passphrase strategy with language configuration
function passphraseExample(): void {
  console.log('\n=== Passphrase Example ===');
  
  // English only
  const englishConfig: SemanticIDGeneratorConfig = {
    dataConceptSeparator: '|',
    compartmentSeparator: '-',
    languageCode: 'eng',
    compartments: [
      { name: 'passphrase', length: 25, generationStrategy: 'passphrase' }
    ]
  };
  
  const englishGenerator = new SemanticIDGenerator(englishConfig);
  const englishId = englishGenerator.generateSemanticID('session');
  
  console.log('English ID:', englishId);
  
  // French only
  const frenchConfig: SemanticIDGeneratorConfig = {
    dataConceptSeparator: '|',
    compartmentSeparator: '-',
    languageCode: 'fra',
    compartments: [
      { name: 'passphrase', length: 25, generationStrategy: 'passphrase' }
    ]
  };
  
  const frenchGenerator = new SemanticIDGenerator(frenchConfig);
  const frenchId = frenchGenerator.generateSemanticID('session');
  
  console.log('French ID:', frenchId);
}

// Example 4: Mixed strategies with type validation
function mixedStrategiesExample(): void {
  console.log('\n=== Mixed Strategies Example ===');
  
  const compartments: Compartment[] = [
    { name: 'prefix', length: 8, generationStrategy: 'visible characters' },
    { name: 'numbers', length: 10, generationStrategy: 'numbers' },
    { name: 'alphanumeric', length: 12, generationStrategy: 'alphanumeric' },
    { name: 'hex', length: 16, generationStrategy: 'hexadecimal' }
  ];
  
  const config: SemanticIDGeneratorConfig = {
    dataConceptSeparator: '|',
    compartmentSeparator: '-',
    compartments
  };
  
  const generator = new SemanticIDGenerator(config);
  const id = generator.generateSemanticID('mixed_strategy');
  
  console.log('Mixed Strategy ID:', id);
}

// Example 5: Type-safe strategy validation
function validateStrategy(strategy: GenerationStrategy): boolean {
  const validStrategies: GenerationStrategy[] = [
    'all characters',
    'visible characters', 
    'numbers',
    'alphanumeric',
    'hexadecimal',
    'base64',
    'passphrase'
  ];
  
  return validStrategies.includes(strategy);
}

// Example 6: Language code validation
function validateLanguageCode(code: LanguageCode): boolean {
  const validLanguages: LanguageCode[] = ['eng', 'fra', 'spa', 'ita', 'deu', 'nld', 'wol'];
  return validLanguages.includes(code);
}

// Example 7: Configuration builder with type safety
class ConfigurationBuilder {
  private config: SemanticIDGeneratorConfig = {};
  
  setDataConceptSeparator(separator: string): this {
    this.config.dataConceptSeparator = separator;
    return this;
  }
  
  setCompartmentSeparator(separator: string): this {
    this.config.compartmentSeparator = separator;
    return this;
  }
  
  addCompartment(compartment: Compartment): this {
    if (!this.config.compartments) {
      this.config.compartments = [];
    }
    this.config.compartments.push(compartment);
    return this;
  }
  
  setLanguageCode(languageCode: LanguageCode): this {
    this.config.languageCode = languageCode;
    return this;
  }
  
  build(): SemanticIDGeneratorConfig {
    return { ...this.config };
  }
}

function builderExample(): void {
  console.log('\n=== Builder Pattern Example ===');
  
  const config = new ConfigurationBuilder()
    .setDataConceptSeparator('|')
    .setCompartmentSeparator('-')
    .addCompartment({ name: 'prefix', length: 6, generationStrategy: 'visible characters' })
    .addCompartment({ name: 'uuid', length: 32, generationStrategy: 'hexadecimal' })
    .setLanguageCode('eng')
    .build();
  
  const generator = new SemanticIDGenerator(config);
  const id = generator.generateSemanticID('builder_example');
  
  console.log('Builder Pattern ID:', id);
}

// Example 8: Error handling with TypeScript
function errorHandlingExample(): void {
  console.log('\n=== Error Handling Example ===');
  
  try {
    // This will throw an error due to invalid configuration
    const invalidConfig: SemanticIDGeneratorConfig = {
      compartments: [
        { name: '', length: -1, generationStrategy: 'invalid' as GenerationStrategy }
      ]
    };
    
    new SemanticIDGenerator(invalidConfig);
  } catch (error) {
    console.log('Caught expected error:', (error as Error).message);
  }
  
  try {
    const generator = new SemanticIDGenerator();
    // This will throw an error due to invalid data concept name
    generator.generateSemanticID('');
  } catch (error) {
    console.log('Caught expected error:', (error as Error).message);
  }
}

// Run all examples
function runExamples(): void {
  basicExample();
  customConfigurationExample();
  passphraseExample();
  mixedStrategiesExample();
  builderExample();
  errorHandlingExample();
  
  // Demonstrate type validation
  console.log('\n=== Type Validation Examples ===');
  console.log('Valid strategy:', validateStrategy('base64'));
  console.log('Invalid strategy:', validateStrategy('invalid' as GenerationStrategy));
  console.log('Valid language:', validateLanguageCode('eng'));
  console.log('Invalid language:', validateLanguageCode('invalid' as LanguageCode));
}

// Export for use in other modules
export {
  SemanticIDGenerator,
  SemanticIDGeneratorConfig,
  Compartment,
  GenerationStrategy,
  LanguageCode,
  ConfigurationBuilder,
  validateStrategy,
  validateLanguageCode,
  runExamples
};

// Run examples if this file is executed directly
if (require.main === module) {
  runExamples();
} 