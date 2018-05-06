const assert = require('chai').assert;
const expect = require('chai').expect;
const config = require('../config');
const CurrencyConverter = require('../helpers/currencies');


const _convertPrice = (from, to, amount, expectedCurrencySymbol) => {
    it(`Convert ${from}${amount} to ${to}`, function () {
        this.timeout(config.testsMaxTimeout);

        return CurrencyConverter.convert(from, to, amount)
            .then(convertedData => {
                expect(convertedData).to.have.all.keys('convertedAmount', 'currency');
                const { convertedAmount, currency } = convertedData;
                expect(convertedAmount).to.be.a('number', 'Converted amount should have been a number, but it is a ', typeof (convertedAmount), '.');
                assert(expectedCurrencySymbol === currency, `Currency should have been equal to "${expectedCurrencySymbol}", but it is "${currency}."`);
                if (from === to) {
                    assert(amount === convertedAmount, 'The converted amount should have been equal to the initial one as the from and to currency symbols are the same.');
                }
            })
            .catch(err => {
                assert(false, err.message);
            })
    });
}


describe('Currency converter', () => {
    _convertPrice('$', '£', 328, '£');
    _convertPrice('£', '£', 420, '£');
    _convertPrice('£', '€', 794, '€');
});





