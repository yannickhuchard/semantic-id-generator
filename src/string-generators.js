/*
    A collection of functions representing String Generation strategies for Semantic ID generation.

    Each of these functions must be bound to a strategy named defined in the file semantic-id-generator.js/"stringGenerationStrategyToFunctionMap".
	
    @created by Yannick Huchard
    @link https://yannickhuchard.com
    @date 08/05/2025

    Dependencies:
        - crypto

    TODO:
    - none

 */

import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WORD_LISTS_CACHE_KEY = Symbol.for('semantic-id-generator.wordLists');
const WORD_LISTS_ERROR_KEY = Symbol.for('semantic-id-generator.wordListsError');

/**
     * Generates a random string of a specific length with Unicode characters.
     *
     * @param {number} length - The length of the string.
     * @param {object} configuration - The configuration object containing separators.
     * @returns {string} - The generated string.
     */
function _generateRandomUnicodeString(length, configuration) {
    // Check if length is a positive integer
    if (!Number.isInteger(length) || length <= 0) {
        throw new Error('Invalid length. It should be a positive integer.');
    }
    
    let string = '';
    const separators = new Set([configuration.dataConceptSeparator, configuration.compartmentSeparator]);
    
    while (string.length < length) {
        const codePoint = _randomPrintableCodePoint();
        const char = String.fromCodePoint(codePoint);
        
        // Only add if not a separator and will not exceed length
        if (!separators.has(char) && string.length + char.length <= length) {
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

function _randomPrintableCodePoint() {
    while (true) {
        const candidate = _randomIntFromInterval(0, 0x10FFFF);

        if (_isDisallowedCodePoint(candidate)) {
            continue;
        }

        return candidate;
    }
}

function _isDisallowedCodePoint(codePoint) {
    // Skip surrogate halves
    if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
        return true;
    }

    // Skip C0 + DEL/C1 controls
    if (codePoint <= 0x1F || (codePoint >= 0x7F && codePoint <= 0x9F)) {
        return true;
    }

    return false;
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
        const randomNumber = crypto.randomInt(0, 10); // Generate a random number between 0 and 9 inclusive
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
        const randomNumber = crypto.randomInt(0, alphanumericChars.length);
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


/**
 * _generateRandomBase64String
 * @param {number} length - The length of the string to generate
 * @param {object} configuration - The configuration object containing separators
 * @returns {string} - The generated Base64 string
 */
function _generateRandomBase64String(length, configuration) {
    // Check if length is a positive integer
    if (!Number.isInteger(length) || length <= 0) {
        throw new Error('Invalid length. It should be a positive integer.');
    }

    let string = '';
    const separators = new Set([configuration.dataConceptSeparator, configuration.compartmentSeparator]);
    
    while (string.length < length) {
        // Generate random bytes and convert to Base64
        const randomBytes = crypto.randomBytes(Math.ceil(length * 0.75)); // Base64 encoding increases size by ~33%
        const base64String = randomBytes.toString('base64');
        
        // Filter out separator characters and add to result
        for (const char of base64String) {
            if (!separators.has(char) && string.length < length) {
                string += char;
            }
        }
    }
    
    // Ensure the string is exactly the requested length
    return string.substring(0, length);
}


/**
 * _generateRandomPassphraseString
 * @param {number} length - The length of the string to generate
 * @param {object} configuration - The configuration object containing separators and optional languageCode
 * @returns {string} - The generated passphrase string
 */
function _generateRandomPassphraseString(length, configuration) {
    // Check if length is a positive integer
    if (!Number.isInteger(length) || length <= 0) {
        throw new Error('Invalid length. It should be a positive integer.');
    }

    // Load word lists from JSON file (cached after first read)
    const wordLists = _getWordLists();

    // Determine which words to use based on configuration
    let commonWords = [];
    
    if (configuration.languageCode && wordLists[configuration.languageCode]) {
        // Use specific language if specified and available
        commonWords = commonWords.concat(wordLists[configuration.languageCode]);
    } else {
        // Use all words from all languages (default behavior)
        Object.values(wordLists).forEach(languageWords => {
            commonWords = commonWords.concat(languageWords);
        });
    }
    
    if (!commonWords || commonWords.length === 0) {
        throw new Error('No words found in word lists');
    }

    let string = '';
    const separators = new Set([configuration.dataConceptSeparator, configuration.compartmentSeparator]);
    
    while (string.length < length) {
        // Select a random word
        const randomIndex = crypto.randomInt(0, commonWords.length);
        const word = commonWords[randomIndex];
        
        // Add the word if it doesn't contain separators and fits within length
        if (!_wordContainsSeparator(word, separators) && string.length + word.length <= length) {
            string += word;
        } else if (string.length < length) {
            // If word doesn't fit or contains separators, add individual characters
            for (const char of word) {
                if (!_wordContainsSeparator(char, separators) && string.length < length) {
                    string += char;
                }
            }
        }
    }
    
    // Ensure the string is exactly the requested length
    return string.substring(0, length);
}

function _getWordLists() {
    const globalCache = globalThis;
    if (globalCache[WORD_LISTS_CACHE_KEY]) {
        return globalCache[WORD_LISTS_CACHE_KEY];
    }

    if (globalCache[WORD_LISTS_ERROR_KEY]) {
        throw globalCache[WORD_LISTS_ERROR_KEY];
    }

    try {
        const wordListsPath = path.join(__dirname, 'data', 'word-lists.json');
        const wordListsData = fs.readFileSync(wordListsPath, 'utf8');
        const parsed = JSON.parse(wordListsData);
        globalCache[WORD_LISTS_CACHE_KEY] = parsed;
        return parsed;
    } catch (error) {
        const failure = new Error('Failed to load word lists from data/word-lists.json');
        globalCache[WORD_LISTS_ERROR_KEY] = failure;
        throw failure;
    }
}

function _wordContainsSeparator(word, separators) {
    for (const separator of separators) {
        if (separator && word.includes(separator)) {
            return true;
        }
    }
    return false;
}


export {
    _generateRandomUnicodeString,
    _generateRandomVisibleUnicodeString,
    _generateRandomNumberString,
    _generateRandomAlphaNumericString,
    _generateRandomHexadecimalString,
    _generateRandomBase64String,
    _generateRandomPassphraseString,
    _generateRandomUUIDv4String,
    _generateRandomUUIDv4DashlessString
};