import { getDomainPreset, getPresetMetadata } from './domain-presets.js';

const CONTEXT = {
    schema: 'https://schema.org/',
    sig: 'https://semantic-id-generator.dev/terms#',
    xsd: 'http://www.w3.org/2001/XMLSchema#'
};

const SCHEMA_BASE_IRI = 'https://semantic-id-generator.dev/schema';
const ENTITY_BASE_IRI = 'https://semantic-id-generator.dev/entity';
const TERMS_BASE_IRI = 'https://semantic-id-generator.dev/terms';

function buildSchemaForPreset(presetName) {
    return {
        preset: presetName,
        jsonld: buildJsonLdSchema(presetName),
        owl: buildOwlSchema(presetName)
    };
}

function exportSchema(presetName, format = 'jsonld') {
    if (format === 'jsonld') {
        return buildJsonLdSchema(presetName);
    }

    if (format === 'owl') {
        return buildOwlSchema(presetName);
    }

    throw new Error(`Unsupported schema format: ${format}`);
}

function buildJsonLdSchema(presetName) {
    const preset = getDomainPreset(presetName);
    const metadata = getPresetMetadata(presetName);
    const schemaIri = `${SCHEMA_BASE_IRI}/${presetName}`;
    const entityIri = `${ENTITY_BASE_IRI}/${metadata.schemaName}`;

    return {
        '@context': CONTEXT,
        '@id': schemaIri,
        '@type': 'sig:SemanticIdentifier',
        'schema:name': `${metadata.schemaName} Semantic Identifier`,
        'schema:description': metadata.description,
        'schema:schemaVersion': '1.0.0',
        'sig:entitySchema': metadata.schemaName,
        'sig:entitySchemaIRI': entityIri,
        'sig:domainClass': metadata.schemaClass,
        'sig:dataConceptSeparator': preset.dataConceptSeparator,
        'sig:compartmentSeparator': preset.compartmentSeparator,
        'sig:compartments': preset.compartments.map((compartment, index) => ({
            '@type': 'sig:Compartment',
            'schema:name': compartment.name,
            'sig:length': compartment.length,
            'sig:generationStrategy': compartment.generationStrategy,
            'sig:position': index
        }))
    };
}

function buildOwlSchema(presetName) {
    const preset = getDomainPreset(presetName);
    const metadata = getPresetMetadata(presetName);
    const schemaIri = `${SCHEMA_BASE_IRI}/${presetName}`;
    const semanticClassIri = `${schemaIri}#${metadata.schemaName}`;
    const domainClassIri = expandSchemaType(metadata.schemaClass);
    const entityIri = `${ENTITY_BASE_IRI}/${metadata.schemaName}`;

    const compartmentProperties = preset.compartments.map((compartment, index) => {
        const propertyIri = `${TERMS_BASE_IRI}#${presetName}/compartment/${encodeFragment(compartment.name)}`;
        return `
    <owl:DatatypeProperty rdf:about="${propertyIri}">
        <rdfs:label>${escapeXml(compartment.name)}</rdfs:label>
        <rdfs:comment>generationStrategy=${escapeXml(compartment.generationStrategy)}; length=${compartment.length}; position=${index}</rdfs:comment>
        <rdfs:domain rdf:resource="${semanticClassIri}" />
        <rdfs:range rdf:resource="http://www.w3.org/2001/XMLSchema#string" />
    </owl:DatatypeProperty>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:owl="http://www.w3.org/2002/07/owl#"
         xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
         xmlns:xsd="http://www.w3.org/2001/XMLSchema#"
         xmlns:schema="https://schema.org/"
         xmlns:sig="${TERMS_BASE_IRI}#">
    <owl:Ontology rdf:about="${schemaIri}">
        <rdfs:comment>${escapeXml(metadata.description)}</rdfs:comment>
    </owl:Ontology>
    <owl:Class rdf:about="${semanticClassIri}">
        <rdfs:label>${escapeXml(metadata.schemaName)}</rdfs:label>
        <rdfs:comment>${escapeXml(metadata.description)}</rdfs:comment>
        <rdfs:subClassOf rdf:resource="${domainClassIri}" />
        <sig:entitySchema rdf:datatype="xsd:string">${escapeXml(metadata.schemaName)}</sig:entitySchema>
        <sig:entitySchemaIRI rdf:datatype="xsd:anyURI">${escapeXml(entityIri)}</sig:entitySchemaIRI>
        <sig:dataConceptSeparator rdf:datatype="xsd:string">${escapeXml(preset.dataConceptSeparator)}</sig:dataConceptSeparator>
        <sig:compartmentSeparator rdf:datatype="xsd:string">${escapeXml(preset.compartmentSeparator)}</sig:compartmentSeparator>
    </owl:Class>${compartmentProperties}
</rdf:RDF>`;
}

function expandSchemaType(schemaType) {
    if (!schemaType) {
        return `${CONTEXT.schema}Thing`;
    }

    if (schemaType.startsWith('schema:')) {
        return schemaType.replace('schema:', CONTEXT.schema);
    }

    return schemaType;
}

function encodeFragment(value) {
    return encodeURIComponent(value.toLowerCase().replace(/\s+/g, '-'));
}

function escapeXml(input) {
    return String(input)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export {
    buildSchemaForPreset,
    buildJsonLdSchema,
    buildOwlSchema,
    exportSchema
};

