/*
    Unit test suite for semantic-id-generator
	
    @created by Yannick Huchard
    @link https://yannickhuchard.com
    @date 08/07/2023

    Dependencies:
        - chai

    TODO:
    - none

 */

    'use strict';

const chai = require('chai');
const SemanticIDGenerator = require('../src/semantic-id-generator');
const expect = chai.expect;

describe('02 | SemanticIDGenerator | Test Configuration ', function() {

    

    it('should generate a valid semantic id from a valid configuration', function() {
        const validConfig = { 
            dataConceptSeparator: '|', 
            compartmentSeparator: '-', 
            compartments: [
                { name: 'part1', length: 10, generationStrategy: "visible characters"},
                { name: 'part2', length: 10, generationStrategy: "numbers"},
                { name: 'part3', length: 32, generationStrategy: "hexadecimal"}
            ] 
        };

        
        const dataConceptName = 'design_decision';
        const generator = new SemanticIDGenerator(validConfig);
        const id = generator.generateSemanticID(dataConceptName);

        // display the generated semantic id
        console.log("\n--------------------------------------------");
        console.log("Generated Semantic Id = " + id);
        console.log("--------------------------------------------\n");

        expect(id.length).to.be.at.least(52 + dataConceptName.length);
    });


    
    it('should throw an error when a configuration contains invalid "name" value', function() {
        const invalidConfig = { 
            dataConceptSeparator: '|', 
            compartmentSeparator: '-', 
            compartments: [
                { name: '', length: 4, generationStrategy: "numbers"},
                { name: 'part2', length: 4, generationStrategy: "numbers"},
                { name: 'part3', length: 20, generationStrategy: "Numbers"}
            ] 
        };

        expect(() => new SemanticIDGenerator(invalidConfig)).to.throw(Error);
    });



    it('should throw an error when a configuration contains invalid "length" values', function() {
        const invalidConfig = { 
            dataConceptSeparator: '|', 
            compartmentSeparator: '-', 
            compartments: [
                { name: 'part1', length: -10, generationStrategy: "numbers"},
                { name: 'part2', length: 12, generationStrategy: "numbers"},
                { name: 'part3', length: 1, generationStrategy: "numbers"}
            ] 
        };

        expect(() => new SemanticIDGenerator(invalidConfig)).to.throw(Error);
    });




    it('should throw an error when a configuration contains invalid "generationStrategy" value', function() {
        const invalidConfig = { 
            dataConceptSeparator: '|', 
            compartmentSeparator: '-', 
            compartments: [
                { name: 'part1', length: 5, generationStrategy: "Random Unicode String"},
                { name: 'part2', length: 12, generationStrategy: "Random Visible Characters"},
                { name: 'part3', length: 8, generationStrategy: "Numbers"}
            ] 
        };

        expect(() => new SemanticIDGenerator(invalidConfig)).to.throw(Error);
    });

});
