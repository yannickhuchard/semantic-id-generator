/**
 * TypeScript type definitions for semantic-id-generator
 * 
 * @created by Yannick Huchard
 * @link https://yannickhuchard.com
 * @date 08/05/2025
 */

/**
 * Supported string generation strategies
 */
export type GenerationStrategy = 
  | 'all characters'
  | 'visible characters'
  | 'numbers'
  | 'alphanumeric'
  | 'hexadecimal'
  | 'base64'
  | 'passphrase';

/**
 * Supported language codes for passphrase generation
 */
export type LanguageCode = 'eng' | 'fra' | 'spa' | 'ita' | 'deu' | 'nld' | 'wol';

/**
 * Configuration for a single compartment
 */
export interface Compartment {
  /** Name of the compartment */
  name: string;
  /** Length of the generated string for this compartment */
  length: number;
  /** Strategy to use for generating this compartment */
  generationStrategy: GenerationStrategy;
}

/**
 * Main configuration object for SemanticIDGenerator
 */
export interface SemanticIDGeneratorConfig {
  /** Separator between data concept name and compartments (default: '|') */
  dataConceptSeparator?: string;
  /** Separator between compartments (default: '-') */
  compartmentSeparator?: string;
  /** Array of compartment configurations */
  compartments?: Compartment[];
  /** Language code for passphrase generation (optional) */
  languageCode?: LanguageCode;
}

/**
 * Default configuration values
 */
export interface DefaultConfig {
  dataConceptSeparator: '|';
  compartmentSeparator: '-';
  compartments: [
    { name: 'part1'; length: 4; generationStrategy: 'visible characters' },
    { name: 'part2'; length: 8; generationStrategy: 'visible characters' },
    { name: 'part3'; length: 12; generationStrategy: 'visible characters' }
  ];
}

/**
 * String generation strategy functions
 * These are internal functions used by the generator
 */
export interface StringGenerators {
  /**
   * Generates a random Unicode string
   * @param length - Length of the string to generate
   * @param configuration - Generator configuration
   * @returns Random Unicode string
   */
  _generateRandomUnicodeString(length: number, configuration: Required<SemanticIDGeneratorConfig>): string;

  /**
   * Generates a random visible Unicode string
   * @param length - Length of the string to generate
   * @param configuration - Generator configuration
   * @returns Random visible Unicode string
   */
  _generateRandomVisibleUnicodeString(length: number, configuration: Required<SemanticIDGeneratorConfig>): string;

  /**
   * Generates a random numeric string
   * @param length - Length of the string to generate
   * @param configuration - Generator configuration
   * @returns Random numeric string
   */
  _generateRandomNumberString(length: number, configuration: Required<SemanticIDGeneratorConfig>): string;

  /**
   * Generates a random alphanumeric string
   * @param length - Length of the string to generate
   * @param configuration - Generator configuration
   * @returns Random alphanumeric string
   */
  _generateRandomAlphaNumericString(length: number, configuration: Required<SemanticIDGeneratorConfig>): string;

  /**
   * Generates a random hexadecimal string
   * @param length - Length of the string to generate
   * @param configuration - Generator configuration
   * @returns Random hexadecimal string
   */
  _generateRandomHexadecimalString(length: number, configuration: Required<SemanticIDGeneratorConfig>): string;

  /**
   * Generates a random Base64 string
   * @param length - Length of the string to generate
   * @param configuration - Generator configuration
   * @returns Random Base64 string
   */
  _generateRandomBase64String(length: number, configuration: Required<SemanticIDGeneratorConfig>): string;

  /**
   * Generates a random passphrase string
   * @param length - Length of the string to generate
   * @param configuration - Generator configuration
   * @returns Random passphrase string
   */
  _generateRandomPassphraseString(length: number, configuration: Required<SemanticIDGeneratorConfig>): string;

  /**
   * Generates a UUID v4 string
   * @returns UUID v4 string
   */
  _generateRandomUUIDv4String(): string;

  /**
   * Generates a UUID v4 string without dashes
   * @returns UUID v4 string without dashes
   */
  _generateRandomUUIDv4DashlessString(): string;
}

/**
 * Word lists for different languages
 */
export interface WordLists {
  eng: string[];
  fra: string[];
  spa: string[];
  ita: string[];
  deu: string[];
  nld: string[];
  wol: string[];
}

/**
 * Mapping of generation strategies to their implementation functions
 */
export interface StringGenerationStrategyMap {
  'all characters': (length: number, config: Required<SemanticIDGeneratorConfig>) => string;
  'visible characters': (length: number, config: Required<SemanticIDGeneratorConfig>) => string;
  'numbers': (length: number, config: Required<SemanticIDGeneratorConfig>) => string;
  'alphanumeric': (length: number, config: Required<SemanticIDGeneratorConfig>) => string;
  'hexadecimal': (length: number, config: Required<SemanticIDGeneratorConfig>) => string;
  'base64': (length: number, config: Required<SemanticIDGeneratorConfig>) => string;
  'passphrase': (length: number, config: Required<SemanticIDGeneratorConfig>) => string;
}

/**
 * Configuration builder class for type-safe configuration building
 */
export class ConfigurationBuilder {
  private config: SemanticIDGeneratorConfig = {};
  
  setDataConceptSeparator(separator: string): this;
  setCompartmentSeparator(separator: string): this;
  addCompartment(compartment: Compartment): this;
  setLanguageCode(languageCode: LanguageCode): this;
  build(): SemanticIDGeneratorConfig;
}

/**
 * Type validation utilities
 */
export function validateStrategy(strategy: GenerationStrategy): boolean;
export function validateLanguageCode(code: LanguageCode): boolean; 