const fetch = require('node-fetch');
const apiKey = "AIzaSyDct7A7CPSk63nt0alNoTzD2j86Iulr7Zg";
const customSearchEngine = "001283578301271081774:by8c0ahji_4";


function getEventLink (eventName) {
  const reqUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${customSearchEngine}&q=${eventName} ra`;

  return new Promise ((resolve, reject) => {
    fetch(reqUrl).then(response =>{
      response.json().then(results => {

        // console.log(results);
        for (result of results.items) {
          if (result.link.includes('https://www.residentadvisor.net/event.aspx')) {
          
            resolve(result.link);
            break;
          }
        }
      })
    })
  })
}


module.exports = {
  getEventLink
}
