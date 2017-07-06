const fx = require('money');
const fetch = require('node-fetch');
const apiKey = require('../config').exchangeRatesAPIKey;


function convert(from, to, amount) {
  const fromCurrency = getCurrencyCode(from);
  const toCurrency = getCurrencyCode(to);

  return new Promise((resolve, reject) => {
    fetch(`https://openexchangerates.org/api/latest.json?app_id=${apiKey}`).then(latestRes => {
      latestRes.json().then(latestData => {

        const {base, rates} = latestData;
        fx.base = base;
        fx.rates = rates;
        const convertedAmount = Math.floor(fx.convert(amount,{from:fromCurrency,to:toCurrency}));
        resolve({
          convertedAmount,
          currency: toCurrency
        });
      })
    })
  })
}

function getCurrencyCode (symbol) {
  const currencies = new Map ([
    ['£','GBP'],
    ['$','USD'],
    ['€','EUR']
  ]);

  return currencies.get(symbol);
}


module.exports = {
  convert
}
