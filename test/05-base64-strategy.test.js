/*
    Unit test suite for Base64 generation strategy
    
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
import { _generateRandomBase64String } from '../src/string-generators.js';


describe('05 | Base64 Generation Strategy | Test', function() {
    this.timeout(0); // Disable Mocha's default timeout for this test suite

    const testConfig = {
        dataConceptSeparator: '|',
        compartmentSeparator: '-'
    };

    describe('Base64 String Generation Function Tests', function() {

        it('should generate Base64 strings with correct length', function() {
            const testLengths = [1, 5, 10, 20, 50];
            
            testLengths.forEach(length => {
                const result = _generateRandomBase64String(length, testConfig);
                expect(result).to.be.a('string');
                expect(result.length).to.equal(length);
            });
        });

        it('should not contain separator characters', function() {
            const result = _generateRandomBase64String(100, testConfig);
            
            expect(result).to.not.include('|');
            expect(result).to.not.include('-');
        });

        it('should generate different strings on multiple calls', function() {
            const results = [];
            for (let i = 0; i < 10; i++) {
                results.push(_generateRandomBase64String(20, testConfig));
            }
            
            // Check that we have at least some different strings
            const uniqueResults = new Set(results);
            expect(uniqueResults.size).to.be.greaterThan(1);
        });

        it('should contain only valid Base64 characters', function() {
            const result = _generateRandomBase64String(50, testConfig);
            const validBase64Chars = /^[A-Za-z0-9+/]*$/;
            
            expect(result).to.match(validBase64Chars);
        });

        it('should throw error for invalid length', function() {
            expect(() => _generateRandomBase64String(0, testConfig)).to.throw(Error);
            expect(() => _generateRandomBase64String(-1, testConfig)).to.throw(Error);
            expect(() => _generateRandomBase64String(1.5, testConfig)).to.throw(Error);
        });

        it('should work with different separator configurations', function() {
            const config1 = { dataConceptSeparator: '!', compartmentSeparator: '@' };
            const config2 = { dataConceptSeparator: '§', compartmentSeparator: '€' };
            
            const result1 = _generateRandomBase64String(20, config1);
            const result2 = _generateRandomBase64String(20, config2);
            
            expect(result1).to.not.include('!');
            expect(result1).to.not.include('@');
            expect(result2).to.not.include('§');
            expect(result2).to.not.include('€');
        });
    });

    describe('Performance Tests', function() {

        it('should generate 10,000 Base64 strings efficiently', function() {
            const iterations = 10000;
            const start = process.hrtime.bigint();
            
            for (let i = 0; i < iterations; i++) {
                _generateRandomBase64String(10, testConfig);
            }
            
            const end = process.hrtime.bigint();
            const elapsed = end - start;
            const elapsedMs = Number(elapsed) / 1000000;
            
            console.log(`\n--------------------------------------------`);
            console.log(`Base64 Performance Test:`);
            console.log(`Generated ${iterations} Base64 strings in ${elapsedMs.toFixed(2)}ms`);
            console.log(`Average time per string: ${(elapsedMs / iterations).toFixed(4)}ms`);
            console.log(`--------------------------------------------\n`);
            
            // Should complete within reasonable time (less than 5 seconds)
            expect(elapsedMs).to.be.lessThan(5000);
        });

        it('should handle large Base64 strings efficiently', function() {
            const largeLength = 1000;
            const iterations = 100;
            const start = process.hrtime.bigint();
            
            for (let i = 0; i < iterations; i++) {
                _generateRandomBase64String(largeLength, testConfig);
            }
            
            const end = process.hrtime.bigint();
            const elapsed = end - start;
            const elapsedMs = Number(elapsed) / 1000000;
            
            console.log(`\n--------------------------------------------`);
            console.log(`Large Base64 Performance Test:`);
            console.log(`Generated ${iterations} Base64 strings of length ${largeLength} in ${elapsedMs.toFixed(2)}ms`);
            console.log(`Average time per large string: ${(elapsedMs / iterations).toFixed(4)}ms`);
            console.log(`--------------------------------------------\n`);
            
            // Should complete within reasonable time (less than 10 seconds)
            expect(elapsedMs).to.be.lessThan(10000);
        });
    });

    describe('Integration Tests', function() {

        it('should work correctly in SemanticIDGenerator with Base64 strategy', function() {
            const config = {
                dataConceptSeparator: '|',
                compartmentSeparator: '-',
                compartments: [
                    { name: 'base64_part', length: 20, generationStrategy: "base64"}
                ]
            };
            
            const generator = new SemanticIDGenerator(config);
            const id = generator.generateSemanticID('test_concept');
            
            expect(id).to.be.a('string');
            expect(id).to.include('test_concept|');
            expect(id.split('|')[1]).to.have.length(20);
        });

        it('should generate unique IDs with Base64 strategy', function() {
            const config = {
                dataConceptSeparator: '|',
                compartmentSeparator: '-',
                compartments: [
                    { name: 'base64_part', length: 30, generationStrategy: "base64"}
                ]
            };
            
            const generator = new SemanticIDGenerator(config);
            const ids = new Set();
            
            for (let i = 0; i < 100; i++) {
                ids.add(generator.generateSemanticID('test'));
            }
            
            // Should have mostly unique IDs (allowing for some collisions)
            expect(ids.size).to.be.greaterThan(90);
        });

        it('should generate semantic IDs with mixed strategies including Base64', function() {
            const config = {
                dataConceptSeparator: '|',
                compartmentSeparator: '-',
                compartments: [
                    { name: 'visible_part', length: 8, generationStrategy: "visible characters"},
                    { name: 'base64_part', length: 16, generationStrategy: "base64"},
                    { name: 'hex_part', length: 12, generationStrategy: "hexadecimal"}
                ]
            };
            
            const generator = new SemanticIDGenerator(config);
            const id = generator.generateSemanticID('mixed_strategy');
            
            console.log(`\n--------------------------------------------`);
            console.log(`Mixed Strategy Semantic ID = ${id}`);
            console.log(`--------------------------------------------\n`);
            
            expect(id).to.be.a('string');
            expect(id).to.include('mixed_strategy|');
            
            const parts = id.split('|')[1].split('-');
            expect(parts).to.have.length(3);
            expect(parts[0]).to.have.length(8);
            expect(parts[1]).to.have.length(16);
            expect(parts[2]).to.have.length(12);
        });
    });
}); 
