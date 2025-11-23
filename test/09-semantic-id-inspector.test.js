import { expect } from 'chai';
import SemanticIDGenerator from '../src/semantic-id-generator.js';
import SemanticIDInspector from '../src/semantic-id-inspector.js';

describe('09 | SemanticIDInspector | Validation & parsing', function() {
    it('should detect presets automatically and return metadata', function() {
        const generator = new SemanticIDGenerator({ preset: 'contract' });
        const id = generator.generateSemanticID('contract');
        const inspector = new SemanticIDInspector();

        const report = inspector.inspect(id);

        expect(report.isValid).to.equal(true);
        expect(report.preset).to.equal('contract');
        expect(report.metadata).to.have.property('schemaName', 'Contract');
        expect(report.compartments).to.have.length(3);
        report.compartments.forEach(compartment => expect(compartment.isValid).to.equal(true));
    });

    it('should flag compartments that contain reserved separators', function() {
        const generator = new SemanticIDGenerator({ preset: 'person' });
        const originalId = generator.generateSemanticID('person');

        const [concept, rest] = originalId.split('|');
        const [first, second, third] = rest.split('-');
        const tamperedSecond = `${second.slice(0, 3)}|${second.slice(3)}`;
        const tamperedId = `${concept}|${first}-${tamperedSecond}-${third}`;

        const inspector = new SemanticIDInspector({ preset: 'person' });
        const report = inspector.inspect(tamperedId);

        expect(report.isValid).to.equal(false);
        const compartmentIssues = report.compartments[1].issues.join(' ');
        expect(compartmentIssues).to.contain('reserved separator');
    });

    it('should validate IDs with custom configurations supplied at inspection time', function() {
        const customConfig = {
            dataConceptSeparator: ':',
            compartmentSeparator: '.',
            compartments: [
                { name: 'prefix', length: 6, generationStrategy: 'visible characters' },
                { name: 'digits', length: 4, generationStrategy: 'numbers' }
            ]
        };

        const generator = new SemanticIDGenerator(customConfig);
        const id = generator.generateSemanticID('asset');
        const inspector = new SemanticIDInspector();

        const report = inspector.inspect(id, customConfig);

        expect(report.isValid).to.equal(true);
        expect(report.preset).to.equal(undefined);
        expect(report.compartments.every(compartment => compartment.isValid)).to.equal(true);
    });

    it('should validate passphrase compartments using the bundled word lists', function() {
        const passphraseConfig = {
            dataConceptSeparator: '|',
            compartmentSeparator: '-',
            languageCode: 'eng',
            compartments: [
                { name: 'passphrase', length: 10, generationStrategy: 'passphrase' }
            ]
        };

        const inspector = new SemanticIDInspector(passphraseConfig);

        const validId = 'session|appleapple';
        const validReport = inspector.inspect(validId);
        expect(validReport.isValid).to.equal(true);

        const invalidId = 'session|applezzzzz';
        const invalidReport = inspector.inspect(invalidId);
        expect(invalidReport.isValid).to.equal(false);
        expect(invalidReport.compartments[0].issues.some(issue => issue.includes('word lists'))).to.equal(true);
    });
});


