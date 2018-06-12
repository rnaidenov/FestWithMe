const fetch = require('node-fetch');
const config = require('../config');
var accents = require('remove-accents');

function getEventLink (eventName) {
 const reqUrl = `https://www.googleapis.com/customsearch/v1?key=${config.googleAPIKey}&cx=${config.googleCSE}&q=${accents.remove(eventName)} ${(new Date()).getFullYear()} ra`;
  return new Promise ((resolve, reject) => {
    fetch(reqUrl).then(response =>{
      response.json().then(results => {
        if (results.items) {
          resolve(results.items[0].link);
        }
        else {
          reject('Invalid event name.')
        }
      })
    })
  })
}

module.exports = {
  getEventLink
}
