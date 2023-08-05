# Semantic ID Generator - NPM Package

![GitHub](https://img.shields.io/github/license/yannickhuchard/semantic-id-generator)
![NPM version](https://img.shields.io/npm/v/semantic-id-generator)

![Logo](/logo/semantic-id-generator_logo_192x192.png) 

## Table of Contents
- [Semantic ID Generator - NPM Package](#semantic-id-generator---npm-package)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
    - [What is a Semantic Identifier?](#what-is-a-semantic-identifier)
    - [Examples](#examples)
  - [String Generation Strategies](#string-generation-strategies)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
  - [Usage](#usage)
    - [Basic Usage](#basic-usage)
    - [Advanced Usage](#advanced-usage)
    - [Default Values](#default-values)
  - [Run unit tests](#run-unit-tests)
  - [License](#license)
  - [About the Author](#about-the-author)

## Introduction
Semantic ID Generator is a Node.js package designed to generate structured and meaningful unique identifiers, named "Semantic ID". These identifiers are composed of different "compartments" each having a specific "semantic meaning" and generation strategy.


### What is a Semantic Identifier?
A Semantic ID is an identifier that implements following AMASE data architecture principles:
- Unique
- Reckognizable by humans and artifial intelligence
- Semantically coherent according to semantic rules defined by the data architects/engineers
- Consistant across all data spaces, including historical changes
- Generated from a configurable Factory

A semantic id follows the pattern:
```
{date concept name}{name separator}{compartment 1}{compartment separator}{compartment 2}{compartment separator}...{compartment N}
```

### Examples
Here a few examples of generated semantic identifiers:
- A **person ID**: `person|AbCd-12345678-9ABCDEF0123456789ABCDEF0`
- An **organization ID**: `organization|7890-MNO56789-123456789ABCDEF01234`
- A **multicurrency account**: `multicurrency_account|XYZ2-87654321-ABCD5678901234567890`
- A **device ID**: `device_id|A1B2-135792468-EDCBA098765432109876`


## String Generation Strategies

Semantic ID Generator uses different string generation strategies to generate each compartment of the semantic ID. Here are the currently available strategies:

- **all characters**: This strategy generates a string that includes all Unicode characters.
- **visible characters**: This strategy generates a string that only includes visible Unicode characters.
- **numbers**: This strategy generates a string that only includes numeric characters (0-9).
- **alphanumeric**: This strategy generates a string that includes both alphabetic (A-Z, a-z) and numeric (0-9) characters.
- **hexadecimal**: This strategy generates a string that includes hexadecimal characters (0-9, a-f).

These strategies can be assigned to each compartment in the Semantic ID Generator configuration. This allows you to customize the generation of each part of the semantic ID according to your requirements.


## Installation

### Prerequisites

Before you can use the Semantic ID Generator, you must have certain software installed on your computer:

- **Node.js**: This is the JavaScript runtime in which the Semantic ID Generator runs. You can download it from https://nodejs.org.

- **NPM**: This is the package manager for Node.js. It is included with the Node.js installation.

After installing Node.js and NPM, you need to install the dependencies of the Semantic ID Generator:
- **uuid**: This is an NPM package that allows you to generate UUIDs. You can install it with the following command:

```shell
npm install uuid
```

Then install the Semantic ID Generator library

```bash
npm install semantic-id-generator
```





## Usage

### Basic Usage

```javascript
const SemanticIDGenerator = require('semantic-id-generator');
const generator = new SemanticIDGenerator();
const id = generator.generateSemanticID('person');
console.log(id); // Outputs looks like 'person|abcd-abcdefgh-abcdefghijkl'
```

### Advanced Usage

```javascript
const SemanticIDGenerator = require('semantic-id-generator');

const config = { 
    dataConceptSeparator: '|', 
    compartmentSeparator: '-', 
    compartments: [
        { name: 'part1', length: 10, generationStrategy: "visible characters"},
        { name: 'part2', length: 10, generationStrategy: "numbers"},
        { name: 'part3', length: 32, generationStrategy: "hexadecimal"}
    ] 
};

const generator = new SemanticIDGenerator(config);
const id = generator.generateSemanticID('person');
console.log(id);
```


### Default Values

If you do not specify certain configuration options when creating a new Semantic ID Generator, the library uses the following default values:

- **dataConceptSeparator**: `|`. It separates the data concept name from the rest of the semantic ID.

- **compartmentSeparator**: `-`. It separates the different compartments within the semantic ID.

- **compartments**: By default, the Semantic ID Generator uses three compartments. The compartments' names are 'part1', 'part2', and 'part3', and their lengths are 4, 8, and 12 characters, respectively.

- **generationStrategy**: "visible characters". This strategy generates strings using visible Unicode characters (excluding separators).




## Run unit tests
Run from your command line interface (Bash, Ksh, Windows Terminal, etc.):

```bash
npm test
```


## License

This project is licensed under [MIT License](LICENSE).

## About the Author

Semantic ID Generator is created by Yannick Huchard, a CTO pursuing the path of the technosage. For more information, visit: 
- [yannickhuchard.com](https://yannickhuchard.com) | [Podcast](https://podcasters.spotify.com/pod/show/yannick-huchard) | [Medium](https://yannick-huchard.medium.com/) | [Youtube](https://www.youtube.com/@YannickHuchard)
- More about AMASE, enterprise engineering methodology for businesses and startups: [amase.io](https://amase.io).
