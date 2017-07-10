var iplocation = require('iplocation')


function findLocaton () {
  return new Promise ((resolve, reject) => {
    iplocation()
      .then(data => {
        const {city, country_name : country} = data;
        resolve({
          city,
          country
        })
      })
      .catch(err => {
        console.error("Could not find location ...", err);
      })
  })
}


module.exports = {
  findLocaton
}
