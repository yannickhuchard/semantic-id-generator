import { normalizeConfiguration } from './configuration-utils.js';
import { getPresetMetadata, getDomainPreset, listDomainPresets } from './domain-presets.js';
import { getWordLists } from './word-lists.js';

const STRATEGY_VALIDATORS = {
    'all characters': validateAllCharacters,
    'visible characters': validateVisibleCharacters,
    'numbers': validateNumeric,
    'alphanumeric': validateAlphanumeric,
    'hexadecimal': validateHexadecimal,
    'base64': validateBase64,
    'passphrase': validatePassphrase
};

const SUPPORTED_GENERATION_STRATEGIES = new Set(Object.keys(STRATEGY_VALIDATORS));
const PASS_PHRASE_DICTIONARY_CACHE = new Map();
const PRESET_HINTS = buildPresetHints();

class SemanticIDInspector {
    constructor(configuration) {
        const hasConfiguration = configuration !== undefined && configuration !== null;
        this.configuration = hasConfiguration
            ? normalizeConfiguration(configuration, {
                strategyResolver: (strategy) => SUPPORTED_GENERATION_STRATEGIES.has(strategy)
            })
            : null;
    }

    inspect(semanticId, configurationOverrides) {
        if (typeof semanticId !== 'string') {
            throw new Error('Invalid semantic ID. Provide a non-empty string.');
        }

        const trimmedId = semanticId.trim();
        if (trimmedId.length === 0) {
            throw new Error('Invalid semantic ID. Provide a non-empty string.');
        }

        const configuration = resolveInspectionConfiguration({
            inspectorConfiguration: this.configuration,
            overrides: configurationOverrides,
            semanticId: trimmedId
        });

        return inspectWithConfiguration(trimmedId, configuration);
    }
}

function resolveInspectionConfiguration({ inspectorConfiguration, overrides, semanticId }) {
    if (overrides !== undefined && overrides !== null) {
        if (typeof overrides !== 'object') {
            throw new Error('Inspection overrides must be an object.');
        }

        return normalizeConfiguration(overrides, {
            strategyResolver: (strategy) => SUPPORTED_GENERATION_STRATEGIES.has(strategy)
        });
    }

    if (inspectorConfiguration) {
        return inspectorConfiguration;
    }

    const detectedPreset = detectPresetFromSemanticId(semanticId);
    if (detectedPreset) {
        return normalizeConfiguration({ preset: detectedPreset }, {
            strategyResolver: (strategy) => SUPPORTED_GENERATION_STRATEGIES.has(strategy)
        });
    }

    throw new Error('Unable to determine configuration for inspection. Provide a preset or configuration.');
}

function inspectWithConfiguration(semanticId, configuration) {
    const issues = [];
    const dataConceptSeparator = configuration.dataConceptSeparator;
    const compartmentSeparator = configuration.compartmentSeparator;
    const conceptSeparatorIndex = semanticId.indexOf(dataConceptSeparator);

    if (conceptSeparatorIndex === -1) {
        issues.push(`Missing data concept separator "${dataConceptSeparator}".`);
    }

    const dataConceptName = conceptSeparatorIndex === -1
        ? ''
        : semanticId.slice(0, conceptSeparatorIndex);
    if (!dataConceptName) {
        issues.push('Missing data concept name.');
    }

    const rawCompartmentSegment = conceptSeparatorIndex === -1
        ? ''
        : semanticId.slice(conceptSeparatorIndex + dataConceptSeparator.length);

    const compartmentValues = rawCompartmentSegment.length === 0
        ? []
        : rawCompartmentSegment.split(compartmentSeparator);

    const expectedCount = configuration.compartments.length;
    if (compartmentValues.length < expectedCount) {
        issues.push(`Expected ${expectedCount} compartments but received ${compartmentValues.length}.`);
    } else if (compartmentValues.length > expectedCount) {
        issues.push(`Found ${compartmentValues.length - expectedCount} unexpected compartment segment(s).`);
    }

    const compartments = configuration.compartments.map((definition, index) => {
        const hasValue = typeof compartmentValues[index] === 'string';
        const value = hasValue ? compartmentValues[index] : '';
        return validateCompartmentValue({
            value,
            definition,
            configuration,
            index,
            missing: !hasValue
        });
    });

    const presetMetadata = configuration.preset ? getPresetMetadata(configuration.preset) : null;

    const isValid = issues.length === 0 && compartments.every(compartment => compartment.isValid);

    return {
        semanticId,
        dataConceptName,
        preset: configuration.preset,
        metadata: presetMetadata,
        configuration: {
            dataConceptSeparator,
            compartmentSeparator,
            languageCode: configuration.languageCode,
            compartmentCount: expectedCount
        },
        isValid,
        issues,
        compartments
    };
}

function validateCompartmentValue({ value, definition, configuration, index, missing }) {
    const issues = [];
    if (missing) {
        issues.push(`Missing value for compartment "${definition.name}" at position ${index}.`);
    }

    if (value.length !== definition.length) {
        issues.push(`Expected length ${definition.length} but received ${value.length}.`);
    }

    const forbiddenSeparator = findForbiddenSeparator(value, configuration);
    if (forbiddenSeparator) {
        issues.push(`Value contains reserved separator "${forbiddenSeparator}".`);
    }

    const validator = STRATEGY_VALIDATORS[definition.generationStrategy];
    if (validator) {
        const strategyResult = validator(value, configuration);
        if (!strategyResult.isValid) {
            issues.push(...strategyResult.issues);
        }
    }

    return {
        name: definition.name,
        position: index,
        expectedLength: definition.length,
        generationStrategy: definition.generationStrategy,
        value,
        isValid: issues.length === 0,
        issues
    };
}

function validateAllCharacters(value) {
    const invalidCodePoints = [];
    for (const char of value) {
        const codePoint = char.codePointAt(0);
        if (!isPrintableCodePoint(codePoint)) {
            invalidCodePoints.push(codePoint);
        }
    }

    if (invalidCodePoints.length > 0) {
        return {
            isValid: false,
            issues: [`Contains ${invalidCodePoints.length} non-printable character(s).`]
        };
    }

    return { isValid: true, issues: [] };
}

function validateVisibleCharacters(value) {
    const invalidCharacters = [];
    for (const char of value) {
        const codePoint = char.codePointAt(0);
        if (codePoint < 0x20 || codePoint > 0x7E) {
            invalidCharacters.push(char);
        }
    }

    if (invalidCharacters.length > 0) {
        return {
            isValid: false,
            issues: ['Contains characters outside the visible ASCII range.']
        };
    }

    return { isValid: true, issues: [] };
}

function validateNumeric(value) {
    if (!/^[0-9]+$/.test(value)) {
        return {
            isValid: false,
            issues: ['Expected numeric characters (0-9) only.']
        };
    }
    return { isValid: true, issues: [] };
}

function validateAlphanumeric(value) {
    if (!/^[A-Za-z0-9]+$/.test(value)) {
        return {
            isValid: false,
            issues: ['Expected alphanumeric characters (A-Z, a-z, 0-9) only.']
        };
    }
    return { isValid: true, issues: [] };
}

function validateHexadecimal(value) {
    if (!/^[0-9a-f]+$/i.test(value)) {
        return {
            isValid: false,
            issues: ['Expected hexadecimal characters (0-9, a-f) only.']
        };
    }
    return { isValid: true, issues: [] };
}

function validateBase64(value) {
    if (!/^[A-Za-z0-9+/=]+$/.test(value)) {
        return {
            isValid: false,
            issues: ['Expected Base64 characters (A-Z, a-z, 0-9, +, /, =) only.']
        };
    }
    return { isValid: true, issues: [] };
}

function validatePassphrase(value, configuration) {
    if (!/^[A-Za-z]+$/.test(value)) {
        return {
            isValid: false,
            issues: ['Passphrase compartments should only contain letters.']
        };
    }

    const dictionary = getPassphraseDictionary(configuration.languageCode);
    const normalizedValue = value.toLowerCase();

    if (!canSegmentWithDictionary(normalizedValue, dictionary)) {
        return {
            isValid: false,
            issues: ['Value does not map to the known passphrase word lists.']
        };
    }

    return { isValid: true, issues: [] };
}

function getPassphraseDictionary(languageCode) {
    const wordLists = getWordLists();
    const key = languageCode && wordLists[languageCode] ? languageCode : 'all';

    if (PASS_PHRASE_DICTIONARY_CACHE.has(key)) {
        return PASS_PHRASE_DICTIONARY_CACHE.get(key);
    }

    let words = [];
    if (key === 'all') {
        Object.values(wordLists).forEach(languageWords => {
            words = words.concat(languageWords);
        });
    } else {
        words = wordLists[key];
    }

    const normalizedWords = Array.from(new Set(words.map(word => word.toLowerCase())));
    const lengths = Array.from(new Set(normalizedWords.map(word => word.length))).sort((a, b) => a - b);
    const dictionary = {
        words: normalizedWords,
        wordSet: new Set(normalizedWords),
        lengths
    };
    PASS_PHRASE_DICTIONARY_CACHE.set(key, dictionary);
    return dictionary;
}

function canSegmentWithDictionary(value, dictionary) {
    const dp = new Array(value.length + 1).fill(false);
    dp[0] = true;

    for (let i = 0; i < value.length; i++) {
        if (!dp[i]) {
            continue;
        }

        for (const length of dictionary.lengths) {
            const end = i + length;
            if (end > value.length) {
                continue;
            }

            const chunk = value.slice(i, end);
            if (dictionary.wordSet.has(chunk)) {
                dp[end] = true;
            }
        }
    }

    return dp[value.length];
}

function findForbiddenSeparator(value, configuration) {
    const separators = [
        configuration.dataConceptSeparator,
        configuration.compartmentSeparator
    ];

    for (const separator of separators) {
        if (separator && separator.length > 0 && value.includes(separator)) {
            return separator;
        }
    }

    return null;
}

function isPrintableCodePoint(codePoint) {
    if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
        return false;
    }

    if (codePoint <= 0x1F || (codePoint >= 0x7F && codePoint <= 0x9F)) {
        return false;
    }

    return codePoint <= 0x10FFFF;
}

function detectPresetFromSemanticId(semanticId) {
    for (const hint of PRESET_HINTS) {
        const separator = hint.dataConceptSeparator;
        if (!separator) {
            continue;
        }

        if (semanticId.startsWith(`${hint.key}${separator}`)) {
            return hint.key;
        }
    }
    return null;
}

function buildPresetHints() {
    return listDomainPresets().map(key => {
        const config = getDomainPreset(key);
        return {
            key,
            dataConceptSeparator: config.dataConceptSeparator
        };
    });
}

export default SemanticIDInspector;
export { SemanticIDInspector };


