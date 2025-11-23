import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WORD_LISTS_CACHE_KEY = Symbol.for('semantic-id-generator.wordLists');
const WORD_LISTS_ERROR_KEY = Symbol.for('semantic-id-generator.wordListsError');

function getWordLists() {
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

export { getWordLists };


