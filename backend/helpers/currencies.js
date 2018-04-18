const fx = require('money');
const fetch = require('node-fetch');


function convert(from, to, amount) {
  const fromCurrency = getCurrencyCode(from);
  const toCurrency = getCurrencyCode(to);
  console.log(`Converting ${from}${amount} to ${getCurrencyCode(to)}`)

  return new Promise((resolve, reject) => {
    let isLatestRates = Object.keys(fx.rates).length!==0;
    if (!isLatestRates) {
      getLatestRates().then(() => {
        resolve(getConversionData(fromCurrency, toCurrency, amount));
      });
    } else {
        resolve(getConversionData(fromCurrency, toCurrency, amount));
    }
  })
}


function getConversionData(from, to, amount) { 
    return new Promise((resolve,reject) => {
      const convertedAmount = Math.round(fx.convert(amount, { from, to }));     
      resolve({
        convertedAmount,
        currency: to
      });
    });
}

function getLatestRates() {
  return new Promise((resolve, reject) => {
    fetch('http://api.fixer.io/latest').then(latestRes => {
      latestRes.json().then(latestData => {
        const { base, rates } = latestData;
        fx.base = base;
        fx.rates = rates;
        resolve(true);
      })
    })
  })
}


function getCurrencyCode(symbol) {
  const currencies = new Map([
    ['£', 'GBP'],
    ['$', 'USD'],
    ['€', 'EUR']
  ]);

  return currencies.get(symbol);
}

module.exports = {
  convert,
  getCurrencyCode
}
