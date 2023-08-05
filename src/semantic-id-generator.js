/*
    Main file for Semantic ID Generator
	
    @created by Yannick Huchard
    @link https://yannickhuchard.com
    @date 08/07/2023

    Dependencies:
        - crypto

    TODO:
    - none

 */

const crypto = require('crypto');
const { _generateRandomUnicodeString, _generateRandomVisibleUnicodeString, _generateRandomNumberString, _generateRandomAlphaNumericString, _generateRandomHexadecimalString } = require('./string-generators');



const stringGenerationStrategyToFunctionMap = {
    "all characters": _generateRandomUnicodeString,
    "visible characters": _generateRandomVisibleUnicodeString,
    "numbers": _generateRandomNumberString,
    "alphanumeric": _generateRandomAlphaNumericString,
    "hexadecimal": _generateRandomHexadecimalString
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
        if (configuration.dataConceptSeparator && typeof configuration.dataConceptSeparator !== 'string') {
            throw new Error('Invalid dataConceptSeparator. It should be a string.');
        }

        if (configuration.compartmentSeparator && typeof configuration.compartmentSeparator !== 'string') {
            throw new Error('Invalid compartmentSeparator. It should be a string.');
        }

        if (configuration.compartments && !Array.isArray(configuration.compartments)) {
            throw new Error('Invalid compartments. It should be an array.');
        }

        

        this.configuration = {
            dataConceptSeparator: '|',
            compartmentSeparator: '-',
            compartments: [
                { name: 'part1', length: 4, generationStrategy: "visible characters"},
                { name: 'part2', length: 8, generationStrategy: "visible characters"},
                { name: 'part3', length: 12, generationStrategy: "visible characters"}
            ],
            ...configuration,
        };

        this.configuration.compartments.forEach(compartment => {
            const strategy = stringGenerationStrategyToFunctionMap[compartment.generationStrategy];
            if (!strategy || typeof strategy !== 'function') {
                throw new Error('Invalid generationStrategy. Check the documentation for valid strategies.');
            }
        });


        if (this.configuration.compartments) {
            this.configuration.compartments.forEach(compartment => {
                // Check if 'length' is a positive integer
                if (typeof compartment.length !== 'number' || compartment.length <= 0) {
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

module.exports = SemanticIDGenerator;
