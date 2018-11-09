const config = require('../config');
const fetch = require('node-fetch');


// const findLocaton = () => {
//   fetch(${con}')
// }


const findLocaton = () => {
  return new Promise ((resolve, reject) => {
    iplocation()
      .then(data => {
        console.log(data);
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


findLocaton();