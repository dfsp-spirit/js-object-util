js-object-util
===============

A simple static utility class to access nested object properties. Inspired by Immutable API methods like hasIn and getIn.

## Installation

  `npm install js-object-util`

## Usage

    var objectUtil = require('js-object-util');
	
	// some deeply nested example input
	const book = {
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
	
	// let's go
	var keyExists;
	keyExists = objectUtil.hasIn(book, ['publisher', 'address', 'city'];			// true
	keyExists = objectUtil.hasIn(book, ['publisher', 'address', 'notthere'];		// false
	var value;
	value = ObjectUtil.getIn(book, ['year'])										// 2015
	value = objectUtil.getIn(book, ['readers', '1', 'name']							// Brad
      
  
    See the tests for more examples.  


## Tests

  `npm test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.


