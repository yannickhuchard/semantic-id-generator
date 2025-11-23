# Domain Presets & Schema Export

Semantic ID Generator ships **30 domain presets** so teams can mint IDs with consistent semantics in a single line of code. Each preset contains:

- A pre-built generator configuration (separators + compartments)
- Human-readable metadata (schema name, description, superclass)
- JSON-LD and OWL schemas whose name matches the entity while inheriting a well-known vocabulary class

## Core Preset Catalog

| Preset | Schema | Subclass of | Description |
| --- | --- | --- | --- |
| `person` | Person | `schema:Person` | Individual people |
| `individual_customer` | IndividualCustomer | `schema:Person` | Customers who are people |
| `corporate_customer` | CorporateCustomer | `schema:Organization` | Customers that are organizations |
| `employee` | Employee | `schema:Person` | Workforce members |
| `supplier` | Supplier | `schema:Organization` | Vendors or suppliers |
| `partner` | Partner | `schema:Organization` | Strategic/channel partners |
| `organization` | Organization | `schema:Organization` | Generic legal entities |
| `department` | Department | `schema:Organization` | Internal cost centers |
| `role` | Role | `schema:Role` | Functional or security roles |
| `product` | Product | `schema:Product` | Catalog items |
| `product_category` | ProductCategory | `schema:CategoryCodeSet` | Product taxonomies |
| `device` | Device | `schema:Product` | Physical/IoT devices |
| `asset` | Asset | `schema:Product` | Managed assets |
| `inventory_item` | InventoryItem | `schema:Product` | Stock units |
| `contract` | Contract | `schema:Contract` | Legal agreements |
| `order` | Order | `schema:Order` | Customer orders |
| `purchase_order` | PurchaseOrder | `schema:Order` | Procurement POs |
| `invoice` | Invoice | `schema:Invoice` | Accounts receivable/payable |
| `shipment` | Shipment | `schema:ParcelDelivery` | Logistics movements |
| `payment_transaction` | PaymentTransaction | `schema:PaymentService` | Settlement events |
| `financial_account` | FinancialAccount | `schema:FinancialProduct` | Accounts, wallets, ledgers |
| `budget` | Budget | `schema:FinancialProduct` | Budget envelopes |
| `project` | Project | `schema:Project` | Initiatives/projects |
| `task` | Task | `schema:Action` | Tasks or work items |
| `support_case` | SupportCase | `schema:Action` | Support/issue cases |
| `document` | Document | `schema:CreativeWork` | Documents/files |
| `policy_document` | PolicyDocument | `schema:CreativeWork` | Policies/standards |
| `location` | Location | `schema:Place` | Physical/logical locations |
| `event` | Event | `schema:Event` | Events or campaigns |
| `dataset` | Dataset | `schema:Dataset` | Analytical/operational datasets |

## Programmatic Quick Start

```javascript
import SemanticIDGenerator from 'semantic-id-generator';

const generator = new SemanticIDGenerator({ preset: 'person' });
const id = generator.generateSemanticID('person');
console.log(id); // person|AbCd-12345678-9ABCDEF0123456789
```

## Metadata-aware tooling

```javascript
import { getDomainPreset, getPresetMetadata, listDomainPresets } from 'semantic-id-generator';

console.log(listDomainPresets()); // ['person', 'individual_customer', ...]

const config = getDomainPreset('device');
const metadata = getPresetMetadata('device');

console.log(config.compartments.length); // 3
console.log(metadata.schemaClass); // schema:Product
console.log(metadata.description);
```

## Graph-ready schema export

```javascript
import { buildSchemaForPreset, exportSchema } from 'semantic-id-generator';

const { jsonld, owl } = buildSchemaForPreset('contract');

console.log(jsonld['sig:entitySchema']); // "Contract"
console.log(jsonld['sig:domainClass']);  // "schema:Contract"

const owlXml = exportSchema('contract', 'owl');
// Persist jsonld / owl artifacts or push them to a knowledge graph.
```

- JSON-LD and OWL files ship with the package under `/schema/<preset>.jsonld` and `/schema/<preset>.owl`.
- Maintain parity by running `npm run build:schema`, which executes `scripts/build-schemas.mjs`.

