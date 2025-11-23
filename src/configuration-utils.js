import { resolvePresetConfiguration } from './domain-presets.js';

const DEFAULT_CONFIGURATION = {
    dataConceptSeparator: '|',
    compartmentSeparator: '-',
    compartments: [
        { name: 'part1', length: 4, generationStrategy: 'visible characters' },
        { name: 'part2', length: 8, generationStrategy: 'visible characters' },
        { name: 'part3', length: 12, generationStrategy: 'visible characters' }
    ]
};

const cloneCompartments = (compartments) => {
    if (!Array.isArray(compartments)) {
        return [];
    }
    return compartments.map(compartment => ({ ...compartment }));
};

function normalizeConfiguration(configuration = {}, options = {}) {
    const { strategyResolver } = options;
    const { preset, ...runtimeConfiguration } = configuration ?? {};

    if (preset && typeof preset !== 'string') {
        throw new Error('Invalid preset. It should be a string.');
    }

    if (runtimeConfiguration.dataConceptSeparator && typeof runtimeConfiguration.dataConceptSeparator !== 'string') {
        throw new Error('Invalid dataConceptSeparator. It should be a string.');
    }

    if (runtimeConfiguration.compartmentSeparator && typeof runtimeConfiguration.compartmentSeparator !== 'string') {
        throw new Error('Invalid compartmentSeparator. It should be a string.');
    }

    if (runtimeConfiguration.compartments && !Array.isArray(runtimeConfiguration.compartments)) {
        throw new Error('Invalid compartments. It should be an array.');
    }

    const presetConfiguration = preset ? resolvePresetConfiguration(preset, runtimeConfiguration) : null;

    const finalConfiguration = presetConfiguration
        ? { ...DEFAULT_CONFIGURATION, ...presetConfiguration }
        : { ...DEFAULT_CONFIGURATION, ...runtimeConfiguration };

    const baseCompartments = finalConfiguration.compartments ?? DEFAULT_CONFIGURATION.compartments;

    const normalized = {
        ...finalConfiguration,
        preset: preset ?? undefined,
        compartments: cloneCompartments(baseCompartments)
    };

    if (normalized.compartments) {
        normalized.compartments.forEach(compartment => {
            if (!Number.isInteger(compartment.length) || compartment.length <= 0) {
                throw new Error('Invalid compartment length. It should be a positive integer.');
            }

            if (typeof compartment.name !== 'string' || compartment.name.trim() === '') {
                throw new Error('Invalid compartment name. It should be a non-empty string.');
            }

            if (strategyResolver && !strategyResolver(compartment.generationStrategy)) {
                throw new Error('Invalid generationStrategy. Check the documentation for valid strategies.');
            }
        });
    }

    return normalized;
}

export {
    DEFAULT_CONFIGURATION,
    cloneCompartments,
    normalizeConfiguration
};


