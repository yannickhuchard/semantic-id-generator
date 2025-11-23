/**
 * TypeScript definitions for semantic-id-generator
 * 
 * @created by Yannick Huchard
 * @link https://yannickhuchard.com
 * @date 08/05/2025
 */

import { SemanticIDGeneratorConfig } from './types';

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
  readonly configuration: Required<SemanticIDGeneratorConfig>;
}

export default SemanticIDGenerator;
export { SemanticIDGenerator };