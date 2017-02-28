'use strict';

var ObjectUtil = require('../object_util');
jest.unmock('../object_util');

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

describe('Check for existence of keys in objects', function () {

    it('properly detects existing keys', function () {
        expect(ObjectUtil.hasIn(book, ['publisher', 'address', 'city'])).toBe(true);
        expect(ObjectUtil.hasIn(book, ['title'])).toBe(true);
        expect(ObjectUtil.hasIn(book, ['properties', 'includes_ebook'])).toBe(true);
        expect(ObjectUtil.hasIn(book, ['properties', 'whatever'])).toBe(true);
        expect(ObjectUtil.hasIn(book, ['properties', 'dunno'])).toBe(true);
    });

    it('properly detects absence of keys', function () {
        expect(ObjectUtil.hasIn(book, ['publisher', 'address', 'notthere'])).toBe(false);
    });
});

describe('Check for existence of keys in arrays nested in the objects', function () {

    it('properly detects array elements', function () {
        expect(ObjectUtil.hasIn(book, ['readers', '0'])).toBe(true);
        expect(ObjectUtil.hasIn(book, ['readers', '1'])).toBe(true);

        expect(ObjectUtil.hasIn(book, ['readers', '2'])).toBe(false);

        expect(ObjectUtil.hasIn(book, ['readers', '0', 'name'])).toBe(true);
        expect(ObjectUtil.hasIn(book, ['readers', '0', 'age'])).toBe(true);
        expect(ObjectUtil.hasIn(book, ['readers', '0', 'nickname'])).toBe(true);

        expect(ObjectUtil.hasIn(book, ['readers', '0', 'notthere'])).toBe(false);
    });

    it('properly detects array elements based on integers instead of strings as keys', function () {
        expect(ObjectUtil.hasIn(book, ['readers', 0])).toBe(true);
        expect(ObjectUtil.hasIn(book, ['readers', 1])).toBe(true);
    });


    it('properly detects absence of keys', function () {
        expect(ObjectUtil.hasIn(book, ['publisher', 'address', 'notthere'])).toBe(false);
        expect(ObjectUtil.hasIn(book, ['readers', 3])).toBe(false);
    });

    it('properly handles broken array keys', function () {

        expect(ObjectUtil.hasIn(book, ['readers', 1])).toBe(true);
        expect(ObjectUtil.hasIn(book, ['readers', 'nonumber'])).toBe(false);
        expect(ObjectUtil.hasIn(book, ['readers', '1,1'])).toBe(false);
    });
});

describe('Check for existence of non-null and defined keys in objects', function () {

    it('properly detects existing non-null and defined keys', function () {
        expect(ObjectUtil.hasDefinedAndNonNullIn(book, ['publisher', 'address', 'city'])).toBe(true);
        expect(ObjectUtil.hasDefinedAndNonNullIn(book, ['title'])).toBe(true);
        expect(ObjectUtil.hasDefinedAndNonNullIn(book, ['properties', 'includes_ebook'])).toBe(true);

        expect(ObjectUtil.hasDefinedAndNonNullIn(book, ['properties', 'whatever'])).toBe(false);
        expect(ObjectUtil.hasDefinedAndNonNullIn(book, ['properties', 'dunno'])).toBe(false);
    });

    it('properly detects absence of non-null and undefined keys', function () {
        expect(ObjectUtil.hasDefinedAndNonNullIn(book, ['publisher', 'address', 'notthere'])).toBe(false);
    });
});

describe('Check retrieval of nested keys in objects', function () {

    it('properly retrieves keys', function () {
        expect(ObjectUtil.getIn(book, ['title'])).toBe("React");
        expect(ObjectUtil.getIn(book, ['year'])).toBe(2015);

        expect(ObjectUtil.getIn(book, ['publisher', 'address', 'city'])).toBe("Heidelberg");

        expect(ObjectUtil.getIn(book, ['properties', 'includes_ebook'])).toBe(false);
        expect(ObjectUtil.getIn(book, ['properties', 'whatever'])).toBeNull();
        expect(ObjectUtil.getIn(book, ['properties', 'dunno'])).toBeUndefined();

    });
});

describe('Check retrieval of whole arrays', function () {
    it('properly retrieves whole arrays', function () {
        expect(Object.prototype.toString.call( ObjectUtil.getIn(book, ['readers']) ) === '[object Array]').toBe(true);
    });

});


describe('Check string representation of integer test function', function () {
    it('properly accepts simple numbers', function () {
        expect(ObjectUtil._stringRepresentsPositiveIntegerIncludingZero('0')).toBe(true);
        expect(ObjectUtil._stringRepresentsPositiveIntegerIncludingZero('1')).toBe(true);
        expect(ObjectUtil._stringRepresentsPositiveIntegerIncludingZero('13453256236')).toBe(true);
    });

    it('properly rejects negative numbers', function () {
        expect(ObjectUtil._stringRepresentsPositiveIntegerIncludingZero('-1')).toBe(false);
        expect(ObjectUtil._stringRepresentsPositiveIntegerIncludingZero('-13243443.56')).toBe(false);
    });

    it('properly rejects strings which do not represent numbers', function () {
        expect(ObjectUtil._stringRepresentsPositiveIntegerIncludingZero('1,1')).toBe(false);
        expect(ObjectUtil._stringRepresentsPositiveIntegerIncludingZero('wohlkaum')).toBe(false);
    });

    it('properly rejects strings representing floats', function () {
        expect(ObjectUtil._stringRepresentsPositiveIntegerIncludingZero('1.1')).toBe(false);
        expect(ObjectUtil._stringRepresentsPositiveIntegerIncludingZero('1.324324')).toBe(false);
    });
});


describe('Check retrieval of values inside arrays', function () {
    it('properly retrieves values inside arrays', function () {
        expect(ObjectUtil.getIn(book, ['readers', '1', 'name'])).toBe('Brad');
        expect(ObjectUtil.getIn(book, ['readers', '0', 'age'])).toBe(32);
    });

    it('properly retrieves values inside arrays using integers instead of strings as keys', function () {
        expect(ObjectUtil.getIn(book, ['readers', 1, 'name'])).toBe('Brad');
        expect(ObjectUtil.getIn(book, ['readers', 0, 'age'])).toBe(32);
    });

});

describe('Check fine with null values', function () {
    it('properly handles null input', function () {
        expect(ObjectUtil.hasIn(null, ['readers', 1, 'name'])).toBe(false);
        expect(ObjectUtil.hasIn(undefined, ['readers', 0, 'age'])).toBe(false);
    });
});

describe('Check alternate return value of getIn', function () {
    it('properly returns the alternate value if the path does not exist in the object', function () {
        expect(ObjectUtil.hasIn(book, ['readers', 1, 'nonexistant'])).toBe(false);
        expect(ObjectUtil.getIn(book, ['readers', 1, 'nonexistant'], null)).toBe(null);
		expect(ObjectUtil.getIn(book, ['readers', 1, 'nonexistant'], 53)).toBe(53);
		expect(ObjectUtil.getIn(book, ['readers', 1, 'nonexistant'], 'sorry')).toBe('sorry');
		expect(ObjectUtil.getIn(book, ['readers', 1, 'nonexistant'])).toBe(undefined);
    });
});
