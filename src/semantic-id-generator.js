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

import crypto from 'crypto';
import { _generateRandomUnicodeString, _generateRandomVisibleUnicodeString, _generateRandomNumberString, _generateRandomAlphaNumericString, _generateRandomHexadecimalString, _generateRandomBase64String, _generateRandomPassphraseString } from './string-generators.js';
import { resolvePresetConfiguration } from './domain-presets.js';



const stringGenerationStrategyToFunctionMap = {
    "all characters": _generateRandomUnicodeString,
    "visible characters": _generateRandomVisibleUnicodeString,
    "numbers": _generateRandomNumberString,
    "alphanumeric": _generateRandomAlphaNumericString,
    "hexadecimal": _generateRandomHexadecimalString,
    "base64": _generateRandomBase64String,
    "passphrase": _generateRandomPassphraseString
};



const DEFAULT_CONFIGURATION = {
    dataConceptSeparator: '|',
    compartmentSeparator: '-',
    compartments: [
        { name: 'part1', length: 4, generationStrategy: "visible characters"},
        { name: 'part2', length: 8, generationStrategy: "visible characters"},
        { name: 'part3', length: 12, generationStrategy: "visible characters"}
    ],
};

const cloneCompartments = (compartments) => {
    if (!Array.isArray(compartments)) {
        return [];
    }
    return compartments.map(compartment => ({ ...compartment }));
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
        const { preset, ...runtimeConfiguration } = configuration;

        if (preset && typeof preset !== 'string') {
            throw new Error('Invalid preset. It should be a string.');
        }

        if (runtimeConfiguration.dataConceptSeparator && typeof runtimeConfiguration.dataConceptSeparator !== 'string') {
            throw new Error('Invalid dataConceptSeparator. It should be a string.');
        }

        if (runtimeConfiguration.compartmentSeparator && typeof runtimeConfiguration.compartmentSeparator !== 'string') {
            throw new Error('Invalid compartmentSeparator. It should be a string.');
        }

        if (runtimeConfiguration.compartments && !Array.isArray(runtimeConfiguration.compartments)) {
            throw new Error('Invalid compartments. It should be an array.');
        }

        const presetConfiguration = preset ? resolvePresetConfiguration(preset, runtimeConfiguration) : null;

        const finalConfiguration = presetConfiguration
            ? { ...DEFAULT_CONFIGURATION, ...presetConfiguration }
            : { ...DEFAULT_CONFIGURATION, ...runtimeConfiguration };

        const baseCompartments = finalConfiguration.compartments ?? DEFAULT_CONFIGURATION.compartments;

        this.configuration = {
            ...finalConfiguration,
            preset: preset ?? undefined,
            compartments: cloneCompartments(baseCompartments)
        };

        if (this.configuration.compartments) {
            this.configuration.compartments.forEach(compartment => {
                // Check if 'length' is a positive integer
                if (!Number.isInteger(compartment.length) || compartment.length <= 0) {
                    throw new Error('Invalid compartment length. It should be a positive integer.');
                }
        
                // Check if 'name' is a non-empty string
                if (typeof compartment.name !== 'string' || compartment.name.trim() === '') {
                    throw new Error('Invalid compartment name. It should be a non-empty string.');
                }
        
                const strategy = stringGenerationStrategyToFunctionMap[compartment.generationStrategy];
                if (!strategy || typeof strategy !== 'function') {
                    throw new Error('Invalid generationStrategy. Check the documentation for valid strategies.');
                }
            });
        }
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
