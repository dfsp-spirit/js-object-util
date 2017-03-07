js-object-util
===============

A simple static utility class to access nested JSON object properties. Inspired by Immutable API methods like hasIn, getIn and setIn.

## Installation

  The package is available at npmjs, so all you need to do to install it is to tell npm that you want it:

  `npm install js-object-util`
  
  You can find linkes to try it online etc at https://www.npmjs.com/package/js-object-util

## Usage

    var objectUtil = require('js-object-util');
	
	// Some deeply nested JSON example input:
	var book = {
		publisher: {
			name: "dpunkt",
			address: {
				city: "Heidelberg",
				plz: 69123
			}
		},
		title : "React",
		year: 2015,
		properties: {
			includes_ebook: false,
			whatever: null,
			dunno: undefined
		},
		readers: [
			{
				type: "user",
				name: "Johnny",
				age: 32,
				nickname: null
			},
			{
				type: "user",
				name: "Brad",
				age: 13,
				nickname: "Bratze"
			}
		]
	};
	
	// Let's go. Checking for properties:
	var keyExists;
	keyExists = objectUtil.hasIn(book, ['publisher', 'address', 'city']);		// true
	keyExists = objectUtil.hasIn(book, ['publisher', 'address', 'notthere']);	// false
	// Retrieving properties:
	var value;
	value = ObjectUtil.getIn(book, ['year']);							// 2015
	value = objectUtil.getIn(book, ['readers', 1, 'name']);			// Brad
	value = objectUtil.getIn(book, ['readers', 5, 'notthere'], null);			// null
	// Setting properties:
	var new_book
	new_book = ObjectUtil.setIn(book, ['readers', 2, 'name'], 'Dan');
	new_book = ObjectUtil.setIn(new_book, ['readers', 2, 'age'], 14);
      
  
    See the tests for more examples.  


## Tests

   Unit tests using jest are included. They also show code coverage. Tun run them:

  `npm test`
  
## Project status badges

[![Build Status](https://travis-ci.org/dfsp-spirit/js-object-util.svg?branch=master)](https://travis-ci.org/dfsp-spirit/js-object-util)

[![Coverage Status](https://coveralls.io/repos/github/dfsp-spirit/js-object-util/badge.svg?branch=master)](https://coveralls.io/github/dfsp-spirit/js-object-util?branch=master)

## Contributing

The repo is at: https://github.com/dfsp-spirit/js-object-util

Take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code, also make sure you agree with the license. Then send pull request.



