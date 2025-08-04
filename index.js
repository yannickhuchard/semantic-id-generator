/*
    A library that enable the generation of Semantic Identifiers (ID).

    A Semantic ID is an identifier that implements following AMASE (https://amase.io) data architecture principles:
    - Unique
    - Recognizable by humans and artificial intelligence
    - Semantically coherent according to semantic rules defined by the data architects/engineers
    - Consistent across all data spaces defined by the architects
    - Issued from a configurable Semantic Id Factory
	
    @created by Yannick Huchard
    @link https://yannickhuchard.com
    @date 08/05/2025

    Dependencies:
        - crypto
        - uuid

    TODO:
    - none

 */

//----------------------------------
//            Import Modules
//----------------------------------
import SemanticIDGenerator from './src/semantic-id-generator.js';

export default SemanticIDGenerator;