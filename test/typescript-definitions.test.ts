/**
 * TypeScript definitions test for semantic-id-generator
 * 
 * This test verifies that the TypeScript definitions work correctly
 * and provide proper type checking and IntelliSense support.
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

describe('TypeScript Definitions', () => {
  
  it('should provide proper type checking for SemanticIDGenerator', () => {
    // This should compile without errors
    const generator: SemanticIDGenerator = new SemanticIDGenerator();
    const id: string = generator.generateSemanticID('test');
    
    // Basic type checking
    expect(typeof id).to.equal('string');
    expect(id).to.include('test|');
  });

  it('should provide proper type checking for configuration', () => {
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
    
    expect(typeof id).to.equal('string');
    expect(id).to.include('document|');
  });

  it('should provide proper type checking for compartments', () => {
    const compartments: Compartment[] = [
      { name: 'part1', length: 4, generationStrategy: 'numbers' },
      { name: 'part2', length: 8, generationStrategy: 'alphanumeric' },
      { name: 'part3', length: 12, generationStrategy: 'hexadecimal' }
    ];
    
    const config: SemanticIDGeneratorConfig = {
      compartments
    };
    
    const generator = new SemanticIDGenerator(config);
    const id = generator.generateSemanticID('test');
    
    expect(typeof id).to.equal('string');
  });

  it('should provide proper type checking for generation strategies', () => {
    const strategies: GenerationStrategy[] = [
      'all characters',
      'visible characters',
      'numbers',
      'alphanumeric',
      'hexadecimal',
      'base64',
      'passphrase'
    ];
    
    strategies.forEach(strategy => {
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

  it('should provide proper type checking for language codes', () => {
    const languages: LanguageCode[] = ['eng', 'fra', 'spa', 'ita', 'deu', 'nld', 'wol'];
    
    languages.forEach(language => {
      const config: SemanticIDGeneratorConfig = {
        languageCode: language,
        compartments: [
          { name: 'passphrase', length: 25, generationStrategy: 'passphrase' }
        ]
      };
      
      const generator = new SemanticIDGenerator(config);
      const id = generator.generateSemanticID('session');
      
      expect(typeof id).to.equal('string');
    });
  });

  it('should provide proper type checking for readonly configuration', () => {
    const generator = new SemanticIDGenerator();
    
    // TypeScript should know this is readonly
    const config = generator.configuration;
    
    expect(config.dataConceptSeparator).to.equal('|');
    expect(config.compartmentSeparator).to.equal('-');
    expect(config.compartments).to.be.an('array');
  });

  it('should provide proper type checking for error handling', () => {
    try {
      const generator = new SemanticIDGenerator();
      generator.generateSemanticID('test');
    } catch (error) {
      // TypeScript should know this is an Error
      expect((error as Error).message).to.be.a('string');
    }
  });

  it('should provide proper type checking for complex configurations', () => {
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

  it('should provide proper type checking for type unions', () => {
    // Test that TypeScript correctly handles type unions
    const strategy: GenerationStrategy = 'base64';
    const language: LanguageCode = 'eng';
    
    expect(typeof strategy).to.equal('string');
    expect(typeof language).to.equal('string');
    
    const config: SemanticIDGeneratorConfig = {
      compartments: [
        { name: 'test', length: 10, generationStrategy: strategy }
      ],
      languageCode: language
    };
    
    const generator = new SemanticIDGenerator(config);
    const id = generator.generateSemanticID('union_test');
    
    expect(typeof id).to.equal('string');
  });

  it('should provide proper type checking for optional properties', () => {
    // Test that optional properties work correctly
    const minimalConfig: SemanticIDGeneratorConfig = {};
    const partialConfig: SemanticIDGeneratorConfig = {
      dataConceptSeparator: '|'
    };
    const fullConfig: SemanticIDGeneratorConfig = {
      dataConceptSeparator: '|',
      compartmentSeparator: '-',
      compartments: [
        { name: 'test', length: 8, generationStrategy: 'visible characters' }
      ],
      languageCode: 'eng'
    };
    
    // All should work without TypeScript errors
    const generator1 = new SemanticIDGenerator(minimalConfig);
    const generator2 = new SemanticIDGenerator(partialConfig);
    const generator3 = new SemanticIDGenerator(fullConfig);
    
    expect(typeof generator1.generateSemanticID('test')).to.equal('string');
    expect(typeof generator2.generateSemanticID('test')).to.equal('string');
    expect(typeof generator3.generateSemanticID('test')).to.equal('string');
  });

  it('should provide proper type checking for array types', () => {
    // Test array type checking
    const compartments: Compartment[] = [
      { name: 'part1', length: 4, generationStrategy: 'numbers' },
      { name: 'part2', length: 8, generationStrategy: 'alphanumeric' }
    ];
    
    const strategies: GenerationStrategy[] = ['visible characters', 'base64'];
    const languages: LanguageCode[] = ['eng', 'fra'];
    
    expect(compartments).to.be.an('array');
    expect(strategies).to.be.an('array');
    expect(languages).to.be.an('array');
    
    const config: SemanticIDGeneratorConfig = {
      compartments
    };
    
    const generator = new SemanticIDGenerator(config);
    const id = generator.generateSemanticID('array_test');
    
    expect(typeof id).to.equal('string');
  });
}); 