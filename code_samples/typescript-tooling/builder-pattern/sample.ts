/**
 * Builder-pattern configuration for Semantic ID Generator.
 *
 * Run with:
 *   npx ts-node code_samples/typescript-tooling/builder-pattern/sample.ts
 */
import SemanticIDGenerator, {
  type Compartment,
  type LanguageCode,
  type SemanticIDGeneratorConfig
} from '../../../index.js';

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
    this.config.compartments = this.config.compartments ?? [];
    this.config.compartments.push(compartment);
    return this;
  }

  setLanguageCode(code: LanguageCode): this {
    this.config.languageCode = code;
    return this;
  }

  build(): SemanticIDGeneratorConfig {
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

const generator = new SemanticIDGenerator(config);
const id = generator.generateSemanticID('builder');

console.log('Builder-produced ID:', id);

