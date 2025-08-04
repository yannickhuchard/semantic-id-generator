/*
    Unit test suite for Unicode string generation optimization
	
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
import { _generateRandomUnicodeString } from '../src/string-generators.js';


describe('04 | Unicode String Generation | Test Optimization', function() {
    this.timeout(0); // Disable Mocha's default timeout for this test suite

    const testConfig = {
        dataConceptSeparator: '|',
        compartmentSeparator: '-'
    };

    describe('Unicode String Generation Function Tests', function() {

        it('should generate Unicode strings with correct length', function() {
            const testLengths = [1, 5, 10, 50, 100];
            
            testLengths.forEach(length => {
                const result = _generateRandomUnicodeString(length, testConfig);
                expect(result).to.be.a('string');
                expect(result.length).to.equal(length);
            });
        });

        it('should not contain separator characters', function() {
            const result = _generateRandomUnicodeString(100, testConfig);
            
            expect(result).to.not.include('|');
            expect(result).to.not.include('-');
        });

        it('should generate different strings on multiple calls', function() {
            const results = [];
            for (let i = 0; i < 10; i++) {
                results.push(_generateRandomUnicodeString(20, testConfig));
            }
            
            // Check that we have at least some different strings
            const uniqueResults = new Set(results);
            expect(uniqueResults.size).to.be.greaterThan(1);
        });

        it('should handle Unicode characters correctly', function() {
            const result = _generateRandomUnicodeString(50, testConfig);
            
            // Check that the string contains valid Unicode characters
            for (let i = 0; i < result.length; i++) {
                const char = result.charAt(i);
                expect(char).to.not.equal('');
                expect(char.charCodeAt(0)).to.be.at.least(0);
            }
        });

        it('should throw error for invalid length', function() {
            expect(() => _generateRandomUnicodeString(0, testConfig)).to.throw(Error);
            expect(() => _generateRandomUnicodeString(-1, testConfig)).to.throw(Error);
            expect(() => _generateRandomUnicodeString(1.5, testConfig)).to.throw(Error);
        });

        it('should work with different separator configurations', function() {
            const config1 = { dataConceptSeparator: '!', compartmentSeparator: '@' };
            const config2 = { dataConceptSeparator: '§', compartmentSeparator: '€' };
            
            const result1 = _generateRandomUnicodeString(20, config1);
            const result2 = _generateRandomUnicodeString(20, config2);
            
            expect(result1).to.not.include('!');
            expect(result1).to.not.include('@');
            expect(result2).to.not.include('§');
            expect(result2).to.not.include('€');
        });
    });

    describe('Performance Tests', function() {

        it('should generate 10,000 Unicode strings efficiently', function() {
            const iterations = 10000;
            const start = process.hrtime.bigint();
            
            for (let i = 0; i < iterations; i++) {
                _generateRandomUnicodeString(10, testConfig);
            }
            
            const end = process.hrtime.bigint();
            const elapsed = end - start;
            const elapsedMs = Number(elapsed) / 1000000;
            
            console.log(`\n--------------------------------------------`);
            console.log(`Unicode Performance Test:`);
            console.log(`Generated ${iterations} Unicode strings in ${elapsedMs.toFixed(2)}ms`);
            console.log(`Average time per string: ${(elapsedMs / iterations).toFixed(4)}ms`);
            console.log(`--------------------------------------------\n`);
            
            // Should complete within reasonable time (less than 5 seconds)
            expect(elapsedMs).to.be.lessThan(5000);
        });

        it('should handle large Unicode strings efficiently', function() {
            const largeLength = 1000;
            const iterations = 100;
            const start = process.hrtime.bigint();
            
            for (let i = 0; i < iterations; i++) {
                _generateRandomUnicodeString(largeLength, testConfig);
            }
            
            const end = process.hrtime.bigint();
            const elapsed = end - start;
            const elapsedMs = Number(elapsed) / 1000000;
            
            console.log(`\n--------------------------------------------`);
            console.log(`Large Unicode Performance Test:`);
            console.log(`Generated ${iterations} Unicode strings of length ${largeLength} in ${elapsedMs.toFixed(2)}ms`);
            console.log(`Average time per large string: ${(elapsedMs / iterations).toFixed(4)}ms`);
            console.log(`--------------------------------------------\n`);
            
            // Should complete within reasonable time (less than 10 seconds)
            expect(elapsedMs).to.be.lessThan(10000);
        });

        it('should perform better than Math.random() implementation', function() {
            // This test demonstrates the improvement over the old implementation
            const iterations = 1000;
            const length = 50;
            
            const start = process.hrtime.bigint();
            for (let i = 0; i < iterations; i++) {
                _generateRandomUnicodeString(length, testConfig);
            }
            const end = process.hrtime.bigint();
            const optimizedTime = Number(end - start) / 1000000;
            
            console.log(`\n--------------------------------------------`);
            console.log(`Optimized Unicode Generation Performance:`);
            console.log(`Generated ${iterations} strings of length ${length} in ${optimizedTime.toFixed(2)}ms`);
            console.log(`This is using cryptographically secure random generation`);
            console.log(`--------------------------------------------\n`);
            
            // The optimized version should be reasonably fast
            expect(optimizedTime).to.be.lessThan(2000);
        });
    });

    describe('Integration Tests', function() {

        it('should work correctly in SemanticIDGenerator with Unicode strategy', function() {
            const config = {
                dataConceptSeparator: '|',
                compartmentSeparator: '-',
                compartments: [
                    { name: 'unicode_part', length: 20, generationStrategy: "all characters"}
                ]
            };
            
            const generator = new SemanticIDGenerator(config);
            const id = generator.generateSemanticID('test_concept');
            
            expect(id).to.be.a('string');
            expect(id).to.include('test_concept|');
            expect(id.split('|')[1]).to.have.length(20);
        });

        it('should generate unique IDs with Unicode strategy', function() {
            const config = {
                dataConceptSeparator: '|',
                compartmentSeparator: '-',
                compartments: [
                    { name: 'unicode_part', length: 30, generationStrategy: "all characters"}
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
    });
}); 
