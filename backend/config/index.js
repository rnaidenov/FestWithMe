const configValues = require ('./config');

module.exports = {
  getDBConnectionString : () => {
    return `mongodb://${configValues.username}:${configValues.pass}@ds161001.mlab.com:61001/fest-with-me`
  }
}
