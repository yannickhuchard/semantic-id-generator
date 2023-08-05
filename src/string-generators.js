/*
    A collection of functions representing String Generation strategies for Semantic ID generation.

    Each of these functions must be bound to a strategy named defined in the file semantic-id-generator.js/"stringGenerationStrategyToFunctionMap".
	
    @created by Yannick Huchard
    @link https://yannickhuchard.com
    @date 08/07/2023

    Dependencies:
        - crypto

    TODO:
    - none

 */

const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');



/**
     * Generates a random string of a specific length with Unicode characters.
     *
     * @param {number} length - The length of the string.
     *
     * @returns {string} - The generated string.
     */
function _generateRandomUnicodeString(length, configuration) {
    let string = '';
    while (string.length < length) {
        // Generate a random Unicode character (excluding separator)
        const char = String.fromCodePoint(Math.floor(Math.random() * 0x10FFFF));
        if (char !== configuration.dataConceptSeparator && char !== configuration.compartmentSeparator) {
            string += char;
        }
    }
    return string;
}



/**
 * _generateRandomVisibleUnicodeString
 * @param {*} length 
 * @returns 
 */
function _generateRandomVisibleUnicodeString(length, configuration) {
    // Check if length is a positive integer
    if (!Number.isInteger(length) || length <= 0) {
        throw new Error('Invalid length. It should be a positive integer.');
    }
    let string = '';
    while (string.length < length) {
        const char = String.fromCodePoint(_randomIntFromInterval(0x0020, 0x007E));
        if (char !== configuration.dataConceptSeparator && char !== configuration.compartmentSeparator) {
            string += char;
        }
    }
    return string;
}

function _randomIntFromInterval(min, max) {
    const randomBuffer = crypto.randomBytes(4);
    const randomNumber = randomBuffer.readUInt32BE(0);
    return min + Math.floor((max - min + 1) * (randomNumber / 4294967295));
}



/**
 * _generateRandomNumberString
 * @param {*} length 
 * @returns 
 */
function _generateRandomNumberString(length, configuration) {
    // Check if length is a positive integer
    if (!Number.isInteger(length) || length <= 0) {
        throw new Error('Invalid length. It should be a positive integer.');
    }
    let string = '';
    while (string.length < length) {
        const randomNumber = crypto.randomInt(0, 9); // Generate a random number between 0 and 9
        const char = randomNumber.toString();

        if (char !== configuration.dataConceptSeparator && char !== configuration.compartmentSeparator) {
            string += char; // Convert number to string and add it to the generated string
        }
        
    }
    return string;
}


/**
 * _generateRandomAlphaNumericString
 * 
 * @param {*} length 
 * @returns 
 */
function _generateRandomAlphaNumericString(length, configuration) {
    // Check if length is a positive integer
    if (!Number.isInteger(length) || length <= 0) {
        throw new Error('Invalid length. It should be a positive integer.');
    }
    
    const alphanumericChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let string = '';
    while (string.length < length) {
        const randomNumber = crypto.randomInt(0, alphanumericChars.length - 1);
        const char = alphanumericChars[randomNumber];

        if (char !== configuration.dataConceptSeparator && char !== configuration.compartmentSeparator) {
            string += char;
        }
    }
    return string;
}



/**
 * _generateRandomHexadecimalString
 * @param {*} length 
 * @returns 
 */
function _generateRandomHexadecimalString(length, configuration) {
    // Check if length is a positive integer
    if (!Number.isInteger(length) || length <= 0) {
        throw new Error('Invalid length. It should be a positive integer.');
    }

    let string = '';
    while (string.length < length) {
        const buffer = crypto.randomBytes(1); // Generate 1 random byte
        string += buffer.toString('hex'); // Convert byte to hexadecimal and add it to the generated string
    }

    // Ensure the string is not longer than the requested length
    return string.substr(0, length);
}


/**
 * _generateRandomUUIDv4String
 * @returns 
 */
function _generateRandomUUIDv4String() {
    return uuidv4();
}


/**
 * 
 * @returns 
 */
function _generateRandomUUIDv4DashlessString() {
    return uuidv4().replace(/-/g, '');
}


module.exports = {
    _generateRandomUnicodeString,
    _generateRandomVisibleUnicodeString,
    _generateRandomNumberString,
    _generateRandomAlphaNumericString,
    _generateRandomHexadecimalString,
    _generateRandomUUIDv4String,
    _generateRandomUUIDv4DashlessString
};