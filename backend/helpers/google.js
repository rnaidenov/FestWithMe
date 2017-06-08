const google = require('google');


function getEventLink (eventName) {
  return new Promise ((resolve,reject) => {
    google.resultsPerPage = 5;

    google(eventName, function (err, res){
      if (err) console.error(err)
      for (var i = 0; i < res.links.length; ++i) {
        var link = res.links[i];
        if (link.href.includes('https://www.residentadvisor.net/event.aspx')) {
          resolve(link.href);
          break;
        }
      }
    })
  })
}

module.exports = {
  getEventLink
}
