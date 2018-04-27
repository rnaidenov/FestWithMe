const flightScanner = require('skiplagged-node-api');
 
const searchOptions = {
  from: 'SOF',
  to: 'LON',
  // departureDate: '2018-06-09',
  departureDate:'2018-06-10',
  currency:'GBP'
};
 
flightScanner(searchOptions).then(res => console.log(res[0].legs));