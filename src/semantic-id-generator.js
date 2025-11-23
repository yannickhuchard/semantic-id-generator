/*
    Main file for Semantic ID Generator
	
    @created by Yannick Huchard
    @link https://yannickhuchard.com
    @date 08/05/2025

    Dependencies:
        - crypto

    TODO:
    - none

 */

import { _generateRandomUnicodeString, _generateRandomVisibleUnicodeString, _generateRandomNumberString, _generateRandomAlphaNumericString, _generateRandomHexadecimalString, _generateRandomBase64String, _generateRandomPassphraseString } from './string-generators.js';
import { normalizeConfiguration } from './configuration-utils.js';

const stringGenerationStrategyToFunctionMap = {
    "all characters": _generateRandomUnicodeString,
    "visible characters": _generateRandomVisibleUnicodeString,
    "numbers": _generateRandomNumberString,
    "alphanumeric": _generateRandomAlphaNumericString,
    "hexadecimal": _generateRandomHexadecimalString,
    "base64": _generateRandomBase64String,
    "passphrase": _generateRandomPassphraseString
};



/**
 * Main class for Semantic ID Generator
 */
class SemanticIDGenerator {

    /**
     * Constructor
     * @param {*} configuration
     */
    constructor(configuration = {}) {
        this.configuration = normalizeConfiguration(configuration, {
            strategyResolver: (strategy) => typeof stringGenerationStrategyToFunctionMap[strategy] === 'function'
        });
    }



    
    /**
     * Generates a Semantic ID.
     *
     * @param {string} dataConceptName - The name of the data concept.
     * @returns {string} - The generated semantic ID.
     */
    generateSemanticID(dataConceptName) {
        if (typeof dataConceptName !== 'string' || dataConceptName.length === 0) {
            throw new Error('Invalid dataConceptName. It should be a non-empty string.');
        }

        let id = dataConceptName + this.configuration.dataConceptSeparator;

        this.configuration.compartments.forEach((compartment, index) => {
            const strategyFunction = stringGenerationStrategyToFunctionMap[compartment.generationStrategy];

            //console.log("strategy function: " + strategyFunction);

            let generated = strategyFunction(compartment.length, this.configuration);

            id += generated;

            if (index < this.configuration.compartments.length - 1) {
                id += this.configuration.compartmentSeparator;
            }
        });

        return id;
    }

}

export default SemanticIDGenerator;
