import { expect } from 'chai';
import SemanticIDGenerator from '../src/semantic-id-generator.js';


describe('03 | SemanticIDGenerator | Test Performances ', function() {
    this.timeout(0); // Disable Mocha's default timeout for this test suite

    it('should generate 100,000 IDs quickly', function() {
        const generator = new SemanticIDGenerator();
        const iterations = 100000;
        const start = process.hrtime.bigint(); // Get high-resolution real time before the loop starts

        for (let i = 0; i < iterations; i++) {
            generator.generateSemanticID('test');
        }

        const end = process.hrtime.bigint(); // Get high-resolution real time after the loop ends
        const elapsed = end - start; // Calculate the difference

        console.log(`Performance test took ${elapsed / 100000n} milliseconds`); // Convert nanoseconds to milliseconds and log the result
    });
});
