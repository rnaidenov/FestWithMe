const fx = require('money');
const fetch = require('node-fetch');
const config = require('../config');
const LATEST_CURRENCY_RATES_URL = `http://data.fixer.io/api/latest?access_key=${config.fixerAPIKey}`;



const getCurrencyCode = (symbol) => {
  const currencies = new Map([
    ['£', 'GBP'],
    ['$', 'USD'],
    ['€', 'EUR']
  ]);
  return currencies.get(symbol);
}

const _getConversionData = (from, to, amount) => {
  return new Promise((resolve, reject) => {
    try {
      const fromCurrency = getCurrencyCode(from);
      const toCurrency = getCurrencyCode(to);
      const convertedAmount = Math.round(fx.convert(amount, { from: fromCurrency, to: toCurrency }));
      resolve({ convertedAmount, currency: to });
    } catch(err){
      reject(`Unable to convert ${from}${amount} to ${to}. Error: ${err}`);
    }
  });
}


const _getLatestRates = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await fetch(LATEST_CURRENCY_RATES_URL).then(res => res.json());
      const { base, rates } = data;
      Object.assign(fx, { base, rates });
      resolve();
    } catch (err) {
      reject(`Unable to get data for latest currency rates. Error: ${err}`);
    }
  })
}


const convert = (from, to, amount) => {
  return new Promise((resolve, reject) => {
    try {
      const isLatestRates = Object.keys(fx.rates).length !== 0;
      !isLatestRates ? _getLatestRates().then(() => resolve(_getConversionData(from, to, amount))) : resolve(_getConversionData(from, to, amount));
    } catch(err){
      reject(err);
    }
  })
}


module.exports = {
  convert,
  getCurrencyCode
}
