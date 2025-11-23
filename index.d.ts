/**
 * TypeScript definitions for semantic-id-generator
 * 
 * @created by Yannick Huchard
 * @link https://yannickhuchard.com
 * @date 08/05/2025
 */

import { SemanticIDGeneratorConfig, DomainPresetName, DomainPresetConfig, DomainPresetMetadata, SchemaArtifacts, SchemaFormat, JsonLdSchema, ResolvedSemanticIDGeneratorConfig, SemanticIDInspectionResult } from './types';

export * from './types';

/**
 * Main class for generating semantic identifiers
 */
declare class SemanticIDGenerator {
  /**
   * Creates a new SemanticIDGenerator instance
   * @param configuration - Optional configuration object
   * @throws {Error} When configuration is invalid
   */
  constructor(configuration?: SemanticIDGeneratorConfig);

  /**
   * Generates a semantic identifier
   * @param dataConceptName - The name of the data concept (e.g., 'person', 'organization')
   * @returns The generated semantic identifier
   * @throws {Error} When dataConceptName is invalid
   *
   * @example
   * ```typescript
   * const generator = new SemanticIDGenerator();
   * const id = generator.generateSemanticID('person');
   * // Returns: 'person|abcd-efghijkl-mnopqrstuvwx'
   * ```
   */
  generateSemanticID(dataConceptName: string): string;

  /**
   * The current configuration of the generator
   */
  readonly configuration: ResolvedSemanticIDGeneratorConfig;
}

export default SemanticIDGenerator;
export { SemanticIDGenerator };

declare class SemanticIDInspector {
  constructor(configuration?: SemanticIDGeneratorConfig);
  inspect(semanticId: string, configurationOverrides?: SemanticIDGeneratorConfig): SemanticIDInspectionResult;
}

export { SemanticIDInspector };

export function getDomainPreset(name: DomainPresetName): DomainPresetConfig;
export function getPresetMetadata(name: DomainPresetName): DomainPresetMetadata;
export function listDomainPresets(): DomainPresetName[];
export function resolvePresetConfiguration(name: DomainPresetName, overrides?: SemanticIDGeneratorConfig): DomainPresetConfig;
export function buildSchemaForPreset(name: DomainPresetName): SchemaArtifacts;
export function exportSchema(name: DomainPresetName, format?: SchemaFormat): JsonLdSchema | string;