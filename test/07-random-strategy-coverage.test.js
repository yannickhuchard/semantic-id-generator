import { expect } from 'chai';
import { _generateRandomNumberString, _generateRandomAlphaNumericString } from '../src/string-generators.js';

describe('07 | String Generation Strategies | Coverage', function() {
    const baseConfig = {
        dataConceptSeparator: '|',
        compartmentSeparator: '-',
    };

    it('number strategy should be able to emit every digit 0-9', function() {
        const digits = new Set();
        const maxAttempts = 500;

        for (let attempt = 0; attempt < maxAttempts && digits.size < 10; attempt++) {
            digits.add(_generateRandomNumberString(1, baseConfig));
        }

        expect(digits.size).to.equal(10);
        expect(digits.has('9')).to.be.true;
    });

    it('alphanumeric strategy should emit digits and both letter cases', function() {
        const chars = new Set();
        const maxAttempts = 2000;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            chars.add(_generateRandomAlphaNumericString(1, baseConfig));

            if (chars.has('9') && chars.has('Z') && chars.has('z')) {
                break;
            }
        }

        expect(chars.has('9')).to.be.true;
        expect(chars.has('Z')).to.be.true;
        expect(chars.has('z')).to.be.true;
    });
});

