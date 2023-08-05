/*
    A library that enable the generation of Semantic Identifiers (ID).

    A Semantic ID is an identifier that implements following AMASE (https://amase.io) data architecture principles:
    - Unique
    - Reckognizable by humans and artifial intelligence
    - Semantically coherent to derive
    - Consistant across all data spaces defined by the architects
    - Issue from a configurable Semantic Id Factory
	
    @created by Yannick Huchard
    @link https://yannickhuchard.com
    @date 08/07/2023

    Dependencies:
        - crypto
        - uuid

    TODO:
    - none

 */

'use strict';

//----------------------------------
//            Import Modules
//----------------------------------
const SemanticIDGenerator = require('./src/semantic-id-generator');



module.exports = SemanticIDGenerator;