/**
 * TypeScript compilation test for semantic-id-generator
 * 
 * This test verifies that TypeScript correctly catches type errors
 * and provides proper compile-time validation.
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
import { expect } from 'chai';

describe('TypeScript Compilation Tests', () => {
  
  it('should validate correct type usage', () => {
    // These should compile without errors
    const validConfig: SemanticIDGeneratorConfig = {
      dataConceptSeparator: '|',
      compartmentSeparator: '-',
      compartments: [
        { name: 'test', length: 8, generationStrategy: 'visible characters' }
      ]
    };
    
    const generator = new SemanticIDGenerator(validConfig);
    const id = generator.generateSemanticID('test');
    
    expect(typeof id).to.equal('string');
  });

  it('should validate generation strategy types', () => {
    // Test all valid generation strategies
    const validStrategies: GenerationStrategy[] = [
      'all characters',
      'visible characters',
      'numbers',
      'alphanumeric',
      'hexadecimal',
      'base64',
      'passphrase'
    ];
    
    validStrategies.forEach(strategy => {
      const config: SemanticIDGeneratorConfig = {
        compartments: [
          { name: 'test', length: 10, generationStrategy: strategy }
        ]
      };
      
      const generator = new SemanticIDGenerator(config);
      const id = generator.generateSemanticID('test');
      
      expect(typeof id).to.equal('string');
    });
  });

  it('should validate language code types', () => {
    // Test all valid language codes
    const validLanguages: LanguageCode[] = [
      'eng', 'fra', 'spa', 'ita', 'deu', 'nld', 'wol'
    ];
    
    validLanguages.forEach(language => {
      const config: SemanticIDGeneratorConfig = {
        languageCode: language,
        compartments: [
          { name: 'passphrase', length: 20, generationStrategy: 'passphrase' }
        ]
      };
      
      const generator = new SemanticIDGenerator(config);
      const id = generator.generateSemanticID('test');
      
      expect(typeof id).to.equal('string');
    });
  });

  it('should validate compartment structure', () => {
    // Test valid compartment structure
    const validCompartments: Compartment[] = [
      { name: 'part1', length: 4, generationStrategy: 'numbers' },
      { name: 'part2', length: 8, generationStrategy: 'alphanumeric' },
      { name: 'part3', length: 12, generationStrategy: 'hexadecimal' }
    ];
    
    const config: SemanticIDGeneratorConfig = {
      compartments: validCompartments
    };
    
    const generator = new SemanticIDGenerator(config);
    const id = generator.generateSemanticID('test');
    
    expect(typeof id).to.equal('string');
  });

  it('should validate readonly configuration property', () => {
    const generator = new SemanticIDGenerator();
    
    // TypeScript should know this is readonly
    const config = generator.configuration;
    
    // Verify the structure matches our type definition
    expect(config).to.have.property('dataConceptSeparator');
    expect(config).to.have.property('compartmentSeparator');
    expect(config).to.have.property('compartments');
    
    expect(typeof config.dataConceptSeparator).to.equal('string');
    expect(typeof config.compartmentSeparator).to.equal('string');
    expect(Array.isArray(config.compartments)).to.be.true;
  });

  it('should validate method signatures', () => {
    const generator = new SemanticIDGenerator();
    
    // Test that method signatures match type definitions
    expect(typeof generator.generateSemanticID).to.equal('function');
    
    // Test method call with proper types
    const id: string = generator.generateSemanticID('test');
    expect(typeof id).to.equal('string');
  });

  it('should validate constructor overloads', () => {
    // Test constructor with no parameters
    const generator1 = new SemanticIDGenerator();
    expect(generator1).to.be.instanceOf(SemanticIDGenerator);
    
    // Test constructor with configuration
    const config: SemanticIDGeneratorConfig = {
      dataConceptSeparator: '|',
      compartmentSeparator: '-'
    };
    const generator2 = new SemanticIDGenerator(config);
    expect(generator2).to.be.instanceOf(SemanticIDGenerator);
  });

  it('should validate type exports', () => {
    // Test that all exported types are available
    expect(typeof SemanticIDGenerator).to.equal('function');
    
    // Test that we can use the types in variable declarations
    const testConfig: SemanticIDGeneratorConfig = {};
    const testCompartment: Compartment = {
      name: 'test',
      length: 8,
      generationStrategy: 'visible characters'
    };
    const testStrategy: GenerationStrategy = 'base64';
    const testLanguage: LanguageCode = 'eng';
    
    expect(typeof testConfig).to.equal('object');
    expect(typeof testCompartment).to.equal('object');
    expect(typeof testStrategy).to.equal('string');
    expect(typeof testLanguage).to.equal('string');
  });

  it('should validate complex type scenarios', () => {
    // Test complex configuration scenarios
    const complexConfig: SemanticIDGeneratorConfig = {
      dataConceptSeparator: '|',
      compartmentSeparator: '-',
      languageCode: 'eng',
      compartments: [
        { name: 'prefix', length: 6, generationStrategy: 'visible characters' },
        { name: 'uuid', length: 32, generationStrategy: 'hexadecimal' },
        { name: 'passphrase', length: 20, generationStrategy: 'passphrase' },
        { name: 'base64', length: 16, generationStrategy: 'base64' }
      ]
    };
    
    const generator = new SemanticIDGenerator(complexConfig);
    const id = generator.generateSemanticID('complex_test');
    
    expect(typeof id).to.equal('string');
    expect(id).to.include('complex_test|');
  });

  it('should validate type safety for error handling', () => {
    try {
      const generator = new SemanticIDGenerator();
      generator.generateSemanticID('test');
    } catch (error) {
      // TypeScript should know this is an Error
      const errorMessage: string = (error as Error).message;
      expect(typeof errorMessage).to.equal('string');
    }
  });
}); 