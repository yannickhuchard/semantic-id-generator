/*
    Unit test suite for semantic-id-generator
	
    @created by Yannick Huchard
    @link https://yannickhuchard.com
    @date 08/05/2025

    Dependencies:
        - chai

    TODO:
    - none

 */

import { expect } from 'chai';
import SemanticIDGenerator from '../src/semantic-id-generator.js';

describe('01 | SemanticIDGenerator | Test Main', function() {

   

    it('should generate an ID with the correct number of parts (2) with [conceptName, compartiments]', function() {
        const generator = new SemanticIDGenerator();
        const id = generator.generateSemanticID('person');
        const parts = id.split('|').length; // this counts the number of parts
        

        // display the generated semantic id
        console.log("\n--------------------------------------------");
        console.log("Generated Semantic Id = " + id);
        console.log("--------------------------------------------\n");


        // We should have 2 compartments: 'person' + 3 from default configuration
        expect(parts).to.equal(2);
    });

    

    it('should generate an ID with the correct number of compatiments (3) with [conceptName, compartiments]', function() {
        const generator = new SemanticIDGenerator();
        const id = generator.generateSemanticID('robot');
        const parts = id.split('|'); // this counts the number of main parts
        const compartmentsCount = parts[1].split('-').length; // this counts the number of compartiments
        

        // display the generated semantic id
        console.log("\n--------------------------------------------");
        console.log("Generated Semantic Id = " + id);
        console.log("parts[0] = " + parts[0]);
        console.log("parts[1] = " + parts[1]);
        console.log("--------------------------------------------\n");


        // We should have 3 compartments: 3 from default configuration
        expect(compartmentsCount).to.equal(3);
    });


    
    it('should generate an ID where each compartment has correct length', function() {
        const generator = new SemanticIDGenerator();
        const id = generator.generateSemanticID('person');
        const parts = id.split('|');
        const compartments = parts[1].split('-');


        // display the generated semantic id
        console.log("\n--------------------------------------------");
        console.log("Generated Semantic Id = " + id);
        console.log("parts[0] = " + parts[0]);
        console.log("parts[1] = " + parts[1]);
        console.log("compartments[0] = " + compartments[0]);
        console.log("compartments[1] = " + compartments[1]);
        console.log("compartments[2] = " + compartments[2]);
        console.log("--------------------------------------------\n");

        
        // Check length of each compartment
        expect(parts[0].length).to.equal('person'.length);
        expect(compartments[0].length).to.equal(4);
        expect(compartments[1].length).to.equal(8);
        expect(compartments[2].length).to.equal(12);
    });


    
    it('should throw an error when provided with invalid arguments', function() {
        const generator = new SemanticIDGenerator();


        expect(() => generator.generateSemanticID(123)).to.throw(Error); // dataConceptName is not a string
    });


});
