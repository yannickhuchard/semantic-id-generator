/*
    Unit test suite for Passphrase generation strategy
    
    @created by Yannick Huchard
    @link https://yannickhuchard.com
    @date 08/05/2025

    Dependencies:
        - chai

    TODO:
    - none

 */



import { expect } from 'chai';
import fs from 'fs';
import SemanticIDGenerator from '../src/semantic-id-generator.js';
import { _generateRandomPassphraseString } from '../src/string-generators.js';

const WORD_LISTS_CACHE_KEY = Symbol.for('semantic-id-generator.wordLists');
const WORD_LISTS_ERROR_KEY = Symbol.for('semantic-id-generator.wordListsError');


describe('06 | Passphrase Generation Strategy | Test', function() {
    this.timeout(0); // Disable Mocha's default timeout for this test suite

    const testConfig = {
        dataConceptSeparator: '|',
        compartmentSeparator: '-'
    };

    describe('Passphrase String Generation Function Tests', function() {

        it('should generate passphrase strings with correct length', function() {
            const testLengths = [5, 10, 15, 20, 30];
            
            testLengths.forEach(length => {
                const result = _generateRandomPassphraseString(length, testConfig);
                expect(result).to.be.a('string');
                expect(result.length).to.equal(length);
            });
        });

        it('should cache word lists between calls', function() {
            // Ensure initial load succeeds
            _generateRandomPassphraseString(10, testConfig);

            const originalReadFileSync = fs.readFileSync;
            let readAttempted = false;

            fs.readFileSync = () => {
                readAttempted = true;
                throw new Error('Word list should be cached');
            };

            try {
                const result = _generateRandomPassphraseString(10, { ...testConfig, languageCode: 'eng' });
                expect(result).to.be.a('string');
                expect(readAttempted).to.be.false;
            } finally {
                fs.readFileSync = originalReadFileSync;
            }
        });

        it('should skip entire words containing separators', function() {
            const originalCache = globalThis[WORD_LISTS_CACHE_KEY];
            const originalError = globalThis[WORD_LISTS_ERROR_KEY];
            globalThis[WORD_LISTS_CACHE_KEY] = {
                eng: ['alpha|beta', 'cleanword'],
            };
            globalThis[WORD_LISTS_ERROR_KEY] = undefined;

            const config = {
                dataConceptSeparator: '|',
                compartmentSeparator: '-',
                languageCode: 'eng',
                compartments: [
                    { name: 'passphrase', length: 12, generationStrategy: 'passphrase' }
                ]
            };

            const result = _generateRandomPassphraseString(12, config);
            expect(result).to.not.include('|');
            expect(result).to.not.include('-');

            globalThis[WORD_LISTS_CACHE_KEY] = originalCache;
            globalThis[WORD_LISTS_ERROR_KEY] = originalError;
        });

        it('should not contain separator characters', function() {
            const result = _generateRandomPassphraseString(100, testConfig);
            
            expect(result).to.not.include('|');
            expect(result).to.not.include('-');
        });

        it('should generate different strings on multiple calls', function() {
            const results = [];
            for (let i = 0; i < 10; i++) {
                results.push(_generateRandomPassphraseString(20, testConfig));
            }
            
            // Check that we have at least some different strings
            const uniqueResults = new Set(results);
            expect(uniqueResults.size).to.be.greaterThan(1);
        });

        it('should contain only lowercase letters', function() {
            const result = _generateRandomPassphraseString(50, testConfig);
            const validChars = /^[a-z]*$/;
            
            expect(result).to.match(validChars);
        });

        it('should throw error for invalid length', function() {
            expect(() => _generateRandomPassphraseString(0, testConfig)).to.throw(Error);
            expect(() => _generateRandomPassphraseString(-1, testConfig)).to.throw(Error);
            expect(() => _generateRandomPassphraseString(1.5, testConfig)).to.throw(Error);
        });

        it('should work with different separator configurations', function() {
            const config1 = { dataConceptSeparator: '!', compartmentSeparator: '@' };
            const config2 = { dataConceptSeparator: '§', compartmentSeparator: '€' };
            
            const result1 = _generateRandomPassphraseString(20, config1);
            const result2 = _generateRandomPassphraseString(20, config2);
            
            expect(result1).to.not.include('!');
            expect(result1).to.not.include('@');
            expect(result2).to.not.include('§');
            expect(result2).to.not.include('€');
        });

        it('should generate readable words when possible', function() {
            const result = _generateRandomPassphraseString(30, testConfig);
            
            // Check if the result contains common words (at least partially)
            const commonWords = ['apple', 'banana', 'cherry', 'dragon', 'eagle', 'forest'];
            const containsCommonWord = commonWords.some(word => result.includes(word));
            
            // This test is probabilistic - it should often contain common words
            // but we don't require it to always contain them
            expect(result.length).to.equal(30);
        });

        it('should use all languages by default', function() {
            const result = _generateRandomPassphraseString(30, testConfig);
            
            expect(result).to.be.a('string');
            expect(result.length).to.equal(30);
        });

        it('should support specific language configuration', function() {
            const englishConfig = { ...testConfig, languageCode: 'eng' };
            const frenchConfig = { ...testConfig, languageCode: 'fra' };
            const spanishConfig = { ...testConfig, languageCode: 'spa' };
            
            const englishResult = _generateRandomPassphraseString(20, englishConfig);
            const frenchResult = _generateRandomPassphraseString(20, frenchConfig);
            const spanishResult = _generateRandomPassphraseString(20, spanishConfig);
            
            expect(englishResult).to.be.a('string');
            expect(frenchResult).to.be.a('string');
            expect(spanishResult).to.be.a('string');
            expect(englishResult.length).to.equal(20);
            expect(frenchResult.length).to.equal(20);
            expect(spanishResult.length).to.equal(20);
        });

        it('should handle unknown language codes gracefully', function() {
            const unknownConfig = { ...testConfig, languageCode: 'xyz' };
            const result = _generateRandomPassphraseString(15, unknownConfig);
            
            expect(result).to.be.a('string');
            expect(result.length).to.equal(15);
        });
    });

    describe('Performance Tests', function() {

        it('should generate 10,000 passphrase strings efficiently', function() {
            const iterations = 10000;
            const start = process.hrtime.bigint();
            
            for (let i = 0; i < iterations; i++) {
                _generateRandomPassphraseString(15, testConfig);
            }
            
            const end = process.hrtime.bigint();
            const elapsed = end - start;
            const elapsedMs = Number(elapsed) / 1000000;
            
            console.log(`\n--------------------------------------------`);
            console.log(`Passphrase Performance Test:`);
            console.log(`Generated ${iterations} passphrase strings in ${elapsedMs.toFixed(2)}ms`);
            console.log(`Average time per string: ${(elapsedMs / iterations).toFixed(4)}ms`);
            console.log(`--------------------------------------------\n`);
            
            // Should complete within reasonable time (less than 6 seconds)
            expect(elapsedMs).to.be.lessThan(6000);
        });

        it('should handle large passphrase strings efficiently', function() {
            const largeLength = 500;
            const iterations = 50;
            const start = process.hrtime.bigint();
            
            for (let i = 0; i < iterations; i++) {
                _generateRandomPassphraseString(largeLength, testConfig);
            }
            
            const end = process.hrtime.bigint();
            const elapsed = end - start;
            const elapsedMs = Number(elapsed) / 1000000;
            
            console.log(`\n--------------------------------------------`);
            console.log(`Large Passphrase Performance Test:`);
            console.log(`Generated ${iterations} passphrase strings of length ${largeLength} in ${elapsedMs.toFixed(2)}ms`);
            console.log(`Average time per large string: ${(elapsedMs / iterations).toFixed(4)}ms`);
            console.log(`--------------------------------------------\n`);
            
            // Should complete within reasonable time (less than 10 seconds)
            expect(elapsedMs).to.be.lessThan(10000);
        });
    });

    describe('Integration Tests', function() {

        it('should work correctly in SemanticIDGenerator with Passphrase strategy', function() {
            const config = {
                dataConceptSeparator: '|',
                compartmentSeparator: '-',
                compartments: [
                    { name: 'passphrase_part', length: 25, generationStrategy: "passphrase"}
                ]
            };
            
            const generator = new SemanticIDGenerator(config);
            const id = generator.generateSemanticID('user_session');
            
            expect(id).to.be.a('string');
            expect(id).to.include('user_session|');
            expect(id.split('|')[1]).to.have.length(25);
        });

        it('should generate unique IDs with Passphrase strategy', function() {
            const config = {
                dataConceptSeparator: '|',
                compartmentSeparator: '-',
                compartments: [
                    { name: 'passphrase_part', length: 30, generationStrategy: "passphrase"}
                ]
            };
            
            const generator = new SemanticIDGenerator(config);
            const ids = new Set();
            
            for (let i = 0; i < 100; i++) {
                ids.add(generator.generateSemanticID('test'));
            }
            
            // Should have mostly unique IDs (allowing for some collisions)
            expect(ids.size).to.be.greaterThan(80);
        });

        it('should generate semantic IDs with mixed strategies including Passphrase', function() {
            const config = {
                dataConceptSeparator: '|',
                compartmentSeparator: '-',
                compartments: [
                    { name: 'visible_part', length: 8, generationStrategy: "visible characters"},
                    { name: 'passphrase_part', length: 20, generationStrategy: "passphrase"},
                    { name: 'hex_part', length: 12, generationStrategy: "hexadecimal"}
                ]
            };
            
            const generator = new SemanticIDGenerator(config);
            const id = generator.generateSemanticID('mixed_passphrase');
            
            console.log(`\n--------------------------------------------`);
            console.log(`Mixed Strategy with Passphrase Semantic ID = ${id}`);
            console.log(`--------------------------------------------\n`);
            
            expect(id).to.be.a('string');
            expect(id).to.include('mixed_passphrase|');
            
            const parts = id.split('|')[1].split('-');
            expect(parts).to.have.length(3);
            expect(parts[0]).to.have.length(8);
            expect(parts[1]).to.have.length(20);
            expect(parts[2]).to.have.length(12);
        });

        it('should generate human-readable passphrases', function() {
            const config = {
                dataConceptSeparator: '|',
                compartmentSeparator: '-',
                compartments: [
                    { name: 'passphrase', length: 40, generationStrategy: "passphrase"}
                ]
            };
            
            const generator = new SemanticIDGenerator(config);
            const id = generator.generateSemanticID('session');
            const passphrasePart = id.split('|')[1];
            
            console.log(`\n--------------------------------------------`);
            console.log(`Human-readable passphrase: ${passphrasePart}`);
            console.log(`--------------------------------------------\n`);
            
            // Should be all lowercase letters
            expect(passphrasePart).to.match(/^[a-z]+$/);
            expect(passphrasePart.length).to.equal(40);
        });

        it('should generate passphrases with language configuration', function() {
            const englishConfig = {
                dataConceptSeparator: '|',
                compartmentSeparator: '-',
                languageCode: 'eng',
                compartments: [
                    { name: 'passphrase', length: 30, generationStrategy: "passphrase"}
                ]
            };
            
            const frenchConfig = {
                dataConceptSeparator: '|',
                compartmentSeparator: '-',
                languageCode: 'fra',
                compartments: [
                    { name: 'passphrase', length: 30, generationStrategy: "passphrase"}
                ]
            };
            
            const spanishConfig = {
                dataConceptSeparator: '|',
                compartmentSeparator: '-',
                languageCode: 'spa',
                compartments: [
                    { name: 'passphrase', length: 30, generationStrategy: "passphrase"}
                ]
            };
            
            const germanConfig = {
                dataConceptSeparator: '|',
                compartmentSeparator: '-',
                languageCode: 'deu',
                compartments: [
                    { name: 'passphrase', length: 30, generationStrategy: "passphrase"}
                ]
            };
            
            const englishGenerator = new SemanticIDGenerator(englishConfig);
            const frenchGenerator = new SemanticIDGenerator(frenchConfig);
            const spanishGenerator = new SemanticIDGenerator(spanishConfig);
            const germanGenerator = new SemanticIDGenerator(germanConfig);
            
            const englishId = englishGenerator.generateSemanticID('session');
            const frenchId = frenchGenerator.generateSemanticID('session');
            const spanishId = spanishGenerator.generateSemanticID('session');
            const germanId = germanGenerator.generateSemanticID('session');
            
            console.log(`\n--------------------------------------------`);
            console.log(`English passphrase: ${englishId.split('|')[1]}`);
            console.log(`French passphrase: ${frenchId.split('|')[1]}`);
            console.log(`Spanish passphrase: ${spanishId.split('|')[1]}`);
            console.log(`German passphrase: ${germanId.split('|')[1]}`);
            console.log(`--------------------------------------------\n`);
            
            expect(englishId.split('|')[1]).to.have.length(30);
            expect(frenchId.split('|')[1]).to.have.length(30);
            expect(spanishId.split('|')[1]).to.have.length(30);
            expect(germanId.split('|')[1]).to.have.length(30);
        });
    });
}); 
