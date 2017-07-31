const fetch = require('node-fetch');
const config = require('../config');

function getEventLink (eventName) {
  const reqUrl = `https://www.googleapis.com/customsearch/v1?key=${config.googleAPIKey}&cx=${config.googleCSE}&q=${eventName} ra`;

  return new Promise ((resolve, reject) => {
    fetch(reqUrl).then(response =>{
      response.json().then(results => {
        if (results.items) {
          for (result of results.items) {
            if (result.link.includes('https://www.residentadvisor.net/event.aspx')) {
              resolve(result.link);
              break;
            }
          }
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
