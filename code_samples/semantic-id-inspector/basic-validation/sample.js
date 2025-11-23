import SemanticIDGenerator, { SemanticIDInspector } from '../../../index.js';

const generator = new SemanticIDGenerator({ preset: 'person' });
const inspector = new SemanticIDInspector();

const semanticId = generator.generateSemanticID('person');
console.log('Minted ID:', semanticId);

const report = inspector.inspect(semanticId);
console.log('\nValid inspection:');
console.log('  isValid:', report.isValid);
console.log('  preset:', report.preset);
console.log('  metadata:', report.metadata);
report.compartments.forEach(compartment => {
    console.log(`  compartment[${compartment.position}] -> ${compartment.name}`, {
        strategy: compartment.generationStrategy,
        issues: compartment.issues
    });
});

const [concept, rest] = semanticId.split('|');
const parts = rest.split('-');
const tamperedSecond = `${parts[1].slice(0, 2)}|${parts[1].slice(2)}`;
const tamperedId = `${concept}|${parts[0]}-${tamperedSecond}-${parts[2]}`;

const tamperedReport = inspector.inspect(tamperedId);
console.log('\nTampered inspection:');
console.log('  id:', tamperedId);
console.log('  isValid:', tamperedReport.isValid);
console.log('  global issues:', tamperedReport.issues);
console.log('  second compartment issues:', tamperedReport.compartments[1].issues);


