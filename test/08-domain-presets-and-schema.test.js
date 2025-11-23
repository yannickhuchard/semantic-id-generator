import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import SemanticIDGenerator, {
    buildSchemaForPreset,
    exportSchema,
    getDomainPreset,
    getPresetMetadata,
    listDomainPresets
} from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCHEMA_DIR = path.join(__dirname, '..', 'schema');
const EXPECTED_PRESETS = [
    'person',
    'individual_customer',
    'corporate_customer',
    'employee',
    'supplier',
    'partner',
    'organization',
    'department',
    'role',
    'product',
    'product_category',
    'device',
    'asset',
    'inventory_item',
    'contract',
    'order',
    'purchase_order',
    'invoice',
    'shipment',
    'payment_transaction',
    'financial_account',
    'budget',
    'project',
    'task',
    'support_case',
    'document',
    'policy_document',
    'location',
    'event',
    'dataset'
];

describe('08 | Domain presets & schema export', function () {
    it('exposes all 30 core presets', function () {
        const presets = listDomainPresets();

        expect(presets).to.have.length(EXPECTED_PRESETS.length);
        expect(presets).to.have.members(EXPECTED_PRESETS);
    });

    it('hydrates generator configuration from preset', function () {
        const generator = new SemanticIDGenerator({ preset: 'person' });

        expect(generator.configuration.preset).to.equal('person');
        expect(generator.configuration.compartments).to.have.length(3);
        expect(generator.configuration.compartments[0]).to.include({
            name: 'semantic_prefix',
            length: 4,
            generationStrategy: 'visible characters'
        });
    });

    it('allows overrides on top of preset defaults', function () {
        const generator = new SemanticIDGenerator({
            preset: 'person',
            compartmentSeparator: ':'
        });

        expect(generator.configuration.compartmentSeparator).to.equal(':');
    });

    it('lists all shipped presets with readable configuration', function () {
        const devicePreset = getDomainPreset('device');

        expect(devicePreset.compartments[1]).to.include({
            name: 'numeric_core',
            generationStrategy: 'numbers'
        });
    });

    it('returns metadata aligned with schema inheritance', function () {
        const metadata = getPresetMetadata('individual_customer');

        expect(metadata.schemaName).to.equal('IndividualCustomer');
        expect(metadata.schemaClass).to.equal('schema:Person');
        expect(metadata.description).to.match(/customer/i);
    });

    it('exports JSON-LD identical to bundled schema file', function () {
        const { jsonld } = buildSchemaForPreset('dataset');
        const diskJson = JSON.parse(fs.readFileSync(path.join(SCHEMA_DIR, 'dataset.jsonld'), 'utf-8'));

        expect(jsonld).to.deep.equal(diskJson);
        expect(jsonld['sig:entitySchema']).to.equal('Dataset');
        expect(jsonld['sig:domainClass']).to.equal('schema:Dataset');
    });

    it('exports OWL identical to bundled schema file', function () {
        const owl = exportSchema('dataset', 'owl');
        const diskOwl = fs.readFileSync(path.join(SCHEMA_DIR, 'dataset.owl'), 'utf-8').trim();

        expect(typeof owl).to.equal('string');
        expect(owl.trim()).to.equal(diskOwl);
        expect(owl).to.contain('Dataset');
    });

    it('guards against unknown preset names', function () {
        expect(() => getDomainPreset('unknown')).to.throw(/Unknown domain preset/);
        expect(() => new SemanticIDGenerator({ preset: 'foobar' })).to.throw(/Unknown domain preset/);
    });

    it('guards against unsupported schema formats', function () {
        expect(() => exportSchema('person', 'ttl')).to.throw('Unsupported schema format');
    });

    it('exposes schema metadata matching preset definition', function () {
        const { jsonld } = buildSchemaForPreset('financial_account');

        expect(jsonld['sig:dataConceptSeparator']).to.equal('|');
        expect(jsonld['sig:compartmentSeparator']).to.equal('-');
        expect(jsonld['sig:compartments']).to.have.length(3);

        const [firstCompartment] = jsonld['sig:compartments'];
        expect(firstCompartment['schema:name']).to.equal('semantic_prefix');
        expect(firstCompartment['sig:generationStrategy']).to.equal('visible characters');
    });

    it('ensures preset helpers return cloned objects', function () {
        const presetA = getDomainPreset('device');
        const presetB = getDomainPreset('device');

        presetA.compartments[0].name = 'mutated';
        expect(presetB.compartments[0].name).to.equal('semantic_prefix');
    });
});

