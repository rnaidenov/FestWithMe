const chai = require('chai');
const formatter = require('../helpers/formatter');

const assert = chai.assert;


describe('Date Formatter', () => {

    describe('Format with no change in date', () => {
        it("formatDate(`15 Dec 2017`)", () => {
            const myBirthday = formatter.formatDate('15 Dec 2017');
            const expectedFormat = '2017-12-15';
            assert(myBirthday === expectedFormat,
                `The results of the date formatter should have been 2017-12-15, but it is ${myBirthday}`);
        })
    });


    describe('Format with change in date [more days]', () => {
        it("formatDate(`15 Dec 2017`, { more: true, days: 18 }),", () => {
            const daysAfterMyBirthday = formatter.formatDate('15 Dec 2017', { more: true, days: 18 });
            const expectedFormat = '2018-1-2';
            assert(daysAfterMyBirthday === expectedFormat,
                `The results of the date formatter should have been 2017-12-15, but it is ${daysAfterMyBirthday}`);
        })
    });


    describe('Format with change in date [less days]', () => {
        it("formatDate(`15 Dec 2017`,{ more: false, days: 30 })", () => {
            const daysBeforeMyBirthday = formatter.formatDate('15 Dec 2017', { more: false, days: 30 });
            const expectedFormat = '2017-11-15';
            assert(daysBeforeMyBirthday === expectedFormat,
                `The results of the date formatter should have been 2017-12-15, but it is ${daysBeforeMyBirthday}`);
        })
    });

});

