const path = require('path');
const fs = require('fs');
const solc = require('solc');

const contractPath = path.resolve(__dirname, '../contracts', 'UsersContract.sol');
const contractSource = fs.readFileSync(contractPath, 'utf8');

// To compile Solidity ^0.5.7
const input = {
	language: 'Solidity',
	sources: {
		'UsersContract.sol': {
			content: contractSource
		}
	},
	settings: {
		outputSelection: {
			'*': {
				'*': [ '*' ]
			}
		}
	}
}

// It exports the output to other files
module.exports = JSON.parse(solc.compile(JSON.stringify(input)));
