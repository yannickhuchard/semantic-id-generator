import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { buildSchemaForPreset } from '../src/schema-exporter.js';
import { listDomainPresets } from '../src/domain-presets.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const SCHEMA_DIR = path.join(ROOT_DIR, 'schema');

function ensureSchemaDirectory() {
    fs.mkdirSync(SCHEMA_DIR, { recursive: true });
}

function writeSchemaArtifacts() {
    const presets = listDomainPresets();

    presets.forEach((preset) => {
        const artifacts = buildSchemaForPreset(preset);

        const jsonldPath = path.join(SCHEMA_DIR, `${preset}.jsonld`);
        const owlPath = path.join(SCHEMA_DIR, `${preset}.owl`);

        fs.writeFileSync(jsonldPath, JSON.stringify(artifacts.jsonld, null, 2) + '\n', 'utf-8');
        fs.writeFileSync(owlPath, artifacts.owl.trim() + '\n', 'utf-8');
    });
}

function main() {
    ensureSchemaDirectory();
    writeSchemaArtifacts();
    console.log(`Schema artifacts generated in ${SCHEMA_DIR}`);
}

main();

