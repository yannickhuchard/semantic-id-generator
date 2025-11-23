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
 * Supported domain presets
 */
export type DomainPresetName =
  | 'person'
  | 'individual_customer'
  | 'corporate_customer'
  | 'employee'
  | 'supplier'
  | 'partner'
  | 'organization'
  | 'department'
  | 'role'
  | 'product'
  | 'product_category'
  | 'device'
  | 'asset'
  | 'inventory_item'
  | 'contract'
  | 'order'
  | 'purchase_order'
  | 'invoice'
  | 'shipment'
  | 'payment_transaction'
  | 'financial_account'
  | 'budget'
  | 'project'
  | 'task'
  | 'support_case'
  | 'document'
  | 'policy_document'
  | 'location'
  | 'event'
  | 'dataset';

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
  /** Domain preset shorthands */
  preset?: DomainPresetName;
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
  _generateRandomUnicodeString(length: number, configuration: ResolvedSemanticIDGeneratorConfig): string;

  /**
   * Generates a random visible Unicode string
   * @param length - Length of the string to generate
   * @param configuration - Generator configuration
   * @returns Random visible Unicode string
   */
  _generateRandomVisibleUnicodeString(length: number, configuration: ResolvedSemanticIDGeneratorConfig): string;

  /**
   * Generates a random numeric string
   * @param length - Length of the string to generate
   * @param configuration - Generator configuration
   * @returns Random numeric string
   */
  _generateRandomNumberString(length: number, configuration: ResolvedSemanticIDGeneratorConfig): string;

  /**
   * Generates a random alphanumeric string
   * @param length - Length of the string to generate
   * @param configuration - Generator configuration
   * @returns Random alphanumeric string
   */
  _generateRandomAlphaNumericString(length: number, configuration: ResolvedSemanticIDGeneratorConfig): string;

  /**
   * Generates a random hexadecimal string
   * @param length - Length of the string to generate
   * @param configuration - Generator configuration
   * @returns Random hexadecimal string
   */
  _generateRandomHexadecimalString(length: number, configuration: ResolvedSemanticIDGeneratorConfig): string;

  /**
   * Generates a random Base64 string
   * @param length - Length of the string to generate
   * @param configuration - Generator configuration
   * @returns Random Base64 string
   */
  _generateRandomBase64String(length: number, configuration: ResolvedSemanticIDGeneratorConfig): string;

  /**
   * Generates a random passphrase string
   * @param length - Length of the string to generate
   * @param configuration - Generator configuration
   * @returns Random passphrase string
   */
  _generateRandomPassphraseString(length: number, configuration: ResolvedSemanticIDGeneratorConfig): string;

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
  'all characters': (length: number, config: ResolvedSemanticIDGeneratorConfig) => string;
  'visible characters': (length: number, config: ResolvedSemanticIDGeneratorConfig) => string;
  'numbers': (length: number, config: ResolvedSemanticIDGeneratorConfig) => string;
  'alphanumeric': (length: number, config: ResolvedSemanticIDGeneratorConfig) => string;
  'hexadecimal': (length: number, config: ResolvedSemanticIDGeneratorConfig) => string;
  'base64': (length: number, config: ResolvedSemanticIDGeneratorConfig) => string;
  'passphrase': (length: number, config: ResolvedSemanticIDGeneratorConfig) => string;
}

/**
 * Configuration materialized after applying defaults/presets
 */
export interface ResolvedSemanticIDGeneratorConfig extends Required<Omit<SemanticIDGeneratorConfig, 'preset'>> {
  preset?: DomainPresetName;
}

/**
 * Domain preset configuration returned by helpers
 */
export interface DomainPresetConfig extends Required<Omit<SemanticIDGeneratorConfig, 'preset'>> {}

/**
 * Domain preset metadata
 */
export interface DomainPresetMetadata {
  key: DomainPresetName;
  schemaName: string;
  description: string;
  schemaClass: string;
}

/**
 * JSON-LD schema representation
 */
export interface JsonLdSchema {
  '@context': Record<string, string>;
  '@id': string;
  '@type': string;
  'schema:name': string;
  'schema:description': string;
  'schema:schemaVersion': string;
  'sig:domainClass': string;
  'sig:dataConceptSeparator': string;
  'sig:compartmentSeparator': string;
  'sig:compartments': Array<{
    '@type': string;
    'schema:name': string;
    'sig:length': number;
    'sig:generationStrategy': GenerationStrategy;
    'sig:position': number;
  }>;
}

/**
 * Collection of schema artifacts
 */
export interface SchemaArtifacts {
  preset: DomainPresetName;
  jsonld: JsonLdSchema;
  owl: string;
}

/**
 * Schema export format options
 */
export type SchemaFormat = 'jsonld' | 'owl';

export interface CompartmentInspection {
  name: string;
  position: number;
  expectedLength: number;
  generationStrategy: GenerationStrategy;
  value: string;
  isValid: boolean;
  issues: string[];
}

export interface SemanticIDInspectionResult {
  semanticId: string;
  dataConceptName: string;
  preset?: DomainPresetName;
  metadata?: DomainPresetMetadata | null;
  configuration: {
    dataConceptSeparator: string;
    compartmentSeparator: string;
    languageCode?: LanguageCode;
    compartmentCount: number;
  };
  isValid: boolean;
  issues: string[];
  compartments: CompartmentInspection[];
}

export function getDomainPreset(name: DomainPresetName): DomainPresetConfig;
export function getPresetMetadata(name: DomainPresetName): DomainPresetMetadata;
export function listDomainPresets(): DomainPresetName[];
export function buildSchemaForPreset(name: DomainPresetName): SchemaArtifacts;
export function exportSchema(name: DomainPresetName, format?: SchemaFormat): JsonLdSchema | string;
