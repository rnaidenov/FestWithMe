const assert = require('chai').assert;
const expect = require('chai').expect;
const config = require('../config');
const CurrencyConverter = require('../helpers/currencies');


describe('Currency converter', () => {
    _convertPrice('$','£',328,'GBP');
    _convertPrice('£','£',420,'GBP');
    _convertPrice('£','€',794,'EUR');
});



function _convertPrice (from, to, amount, expectedCurrencyCode) {
    it(`Convert ${from}${amount} to ${to}`, function() {
        this.timeout(config.testsMaxTimeout);

        return CurrencyConverter.convert(from, to, amount)
                .then(convertedData => {
                    expect(convertedData).to.have.all.keys('convertedAmount','currency');
                    const { convertedAmount, currency } = convertedData;
                    expect(convertedAmount).to.be.a('number','Converted amount should have been a number, but it is a ',typeof(convertedAmount),'.');
                    assert(expectedCurrencyCode===currency, `Currency should have been equal to "${expectedCurrencyCode}", but it is "${currency}."`);
                    if (from===to) {
                        assert(amount===convertedAmount,'The converted amount should have been equal to the initial one as the from and to currency symbols are the same.');
                    }
                })
                .catch(err => {
                    assert(false,err.message);
                }) 
    });
} 
