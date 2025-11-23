/*
    Domain presets for Semantic ID Generator

    These presets bundle common compartment structures for frequently requested
    business domains so teams can bootstrap consistent semantics quickly.
*/

const DEFAULT_PRESET_BASE = {
    dataConceptSeparator: '|',
    compartmentSeparator: '-',
};

const DEFAULT_COMPARTMENTS = [
    { name: 'semantic_prefix', length: 4, generationStrategy: 'visible characters' },
    { name: 'numeric_core', length: 8, generationStrategy: 'numbers' },
    { name: 'semantic_suffix', length: 24, generationStrategy: 'hexadecimal' }
];

const CORE_PRESET_DEFINITIONS = [
    { key: 'person', schemaName: 'Person', schemaClass: 'schema:Person', description: 'Unique identifier for an individual person record.' },
    { key: 'individual_customer', schemaName: 'IndividualCustomer', schemaClass: 'schema:Person', description: 'Semantic identifier for a customer who is a natural person.' },
    { key: 'corporate_customer', schemaName: 'CorporateCustomer', schemaClass: 'schema:Organization', description: 'Semantic identifier for a customer that is a legal entity.' },
    { key: 'employee', schemaName: 'Employee', schemaClass: 'schema:Person', description: 'Tracks employees across HR and workforce systems.' },
    { key: 'supplier', schemaName: 'Supplier', schemaClass: 'schema:Organization', description: 'Identifiers for vendors or suppliers fulfilling goods and services.' },
    { key: 'partner', schemaName: 'Partner', schemaClass: 'schema:Organization', description: 'Identifiers for strategic or channel partners.' },
    { key: 'organization', schemaName: 'Organization', schemaClass: 'schema:Organization', description: 'Generic organization identifiers covering any legal entity.' },
    { key: 'department', schemaName: 'Department', schemaClass: 'schema:Organization', description: 'Identifiers for internal cost centers, teams, or departments.' },
    { key: 'role', schemaName: 'Role', schemaClass: 'schema:Role', description: 'Identifiers for functional or security roles assigned to people.' },
    { key: 'product', schemaName: 'Product', schemaClass: 'schema:Product', description: 'Product catalog identifiers spanning physical or digital goods.' },
    { key: 'product_category', schemaName: 'ProductCategory', schemaClass: 'schema:CategoryCodeSet', description: 'Identifiers for product category taxonomies.' },
    { key: 'device', schemaName: 'Device', schemaClass: 'schema:Product', description: 'Identifiers for physical or IoT devices.' },
    { key: 'asset', schemaName: 'Asset', schemaClass: 'schema:Product', description: 'Identifiers for tracked assets such as equipment or licenses.' },
    { key: 'inventory_item', schemaName: 'InventoryItem', schemaClass: 'schema:Product', description: 'Identifiers for inventory instances across warehouses.' },
    { key: 'contract', schemaName: 'Contract', schemaClass: 'schema:Contract', description: 'Identifiers for legal agreements and contracts.' },
    { key: 'order', schemaName: 'Order', schemaClass: 'schema:Order', description: 'Identifiers for customer or internal orders.' },
    { key: 'purchase_order', schemaName: 'PurchaseOrder', schemaClass: 'schema:Order', description: 'Identifiers for procurement purchase orders.' },
    { key: 'invoice', schemaName: 'Invoice', schemaClass: 'schema:Invoice', description: 'Accounts receivable or payable invoice identifiers.' },
    { key: 'shipment', schemaName: 'Shipment', schemaClass: 'schema:ParcelDelivery', description: 'Logistics shipment identifiers for parcels or freight.' },
    { key: 'payment_transaction', schemaName: 'PaymentTransaction', schemaClass: 'schema:PaymentService', description: 'Identifiers for settlement or payment transactions.' },
    { key: 'financial_account', schemaName: 'FinancialAccount', schemaClass: 'schema:FinancialProduct', description: 'Identifiers for bank, wallet, or ledger accounts.' },
    { key: 'budget', schemaName: 'Budget', schemaClass: 'schema:FinancialProduct', description: 'Identifiers for budget envelopes or funding allocations.' },
    { key: 'project', schemaName: 'Project', schemaClass: 'schema:Project', description: 'Identifiers for initiatives or projects.' },
    { key: 'task', schemaName: 'Task', schemaClass: 'schema:Action', description: 'Identifiers for tasks or work items.' },
    { key: 'support_case', schemaName: 'SupportCase', schemaClass: 'schema:Action', description: 'Identifiers for customer or internal support cases.' },
    { key: 'document', schemaName: 'Document', schemaClass: 'schema:CreativeWork', description: 'Identifiers for documents, records, or files.' },
    { key: 'policy_document', schemaName: 'PolicyDocument', schemaClass: 'schema:CreativeWork', description: 'Identifiers for policies, standards, or compliance docs.' },
    { key: 'location', schemaName: 'Location', schemaClass: 'schema:Place', description: 'Identifiers for physical or logical locations.' },
    { key: 'event', schemaName: 'Event', schemaClass: 'schema:Event', description: 'Identifiers for calendar, marketing, or operational events.' },
    { key: 'dataset', schemaName: 'Dataset', schemaClass: 'schema:Dataset', description: 'Identifiers for analytical or operational datasets.' },
];

const DOMAIN_PRESETS = CORE_PRESET_DEFINITIONS.reduce((acc, definition) => {
    acc[definition.key] = {
        configuration: {
            ...DEFAULT_PRESET_BASE,
            compartments: cloneCompartments(definition.compartments ?? DEFAULT_COMPARTMENTS)
        },
        metadata: {
            key: definition.key,
            schemaName: definition.schemaName,
            label: definition.schemaName,
            description: definition.description,
            schemaClass: definition.schemaClass
        }
    };
    return acc;
}, {});

function cloneCompartments(compartments = []) {
    return compartments.map(compartment => ({ ...compartment }));
}

function clonePresetConfig(config) {
    if (!config) {
        return null;
    }

    return {
        ...config,
        compartments: cloneCompartments(config.compartments)
    };
}

function getPresetDefinition(name) {
    if (typeof name !== 'string') {
        throw new Error('Preset name must be a string');
    }

    const definition = DOMAIN_PRESETS[name];
    if (!definition) {
        throw new Error(`Unknown domain preset: ${name}`);
    }

    return definition;
}

function getDomainPreset(name) {
    const definition = getPresetDefinition(name);
    return clonePresetConfig(definition.configuration);
}

function getPresetMetadata(name) {
    const definition = getPresetDefinition(name);
    return { ...definition.metadata };
}

function listDomainPresets() {
    return Object.keys(DOMAIN_PRESETS);
}

function resolvePresetConfiguration(name, overrides = {}) {
    const basePreset = getDomainPreset(name);

    return {
        ...basePreset,
        ...overrides,
        compartments: cloneCompartments(overrides.compartments ?? basePreset.compartments)
    };
}

export {
    getDomainPreset,
    getPresetMetadata,
    listDomainPresets,
    resolvePresetConfiguration
};

