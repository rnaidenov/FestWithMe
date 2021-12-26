const configValues = require ('./config');

module.exports = {
  getDBConnectionString : () => {
    return `mongodb+srv://${configValues.username}:${configValues.pass}@ds161001.mlab.com:61001/fest-with-me`
  },
  amadeusAPIKey : configValues.amadeusAPIKey,
  googleAPIKey : configValues.googleAPIKey,
  googleCSE : configValues.googleCSE,
  googleMapsKey : configValues.googleMapsKey,
  testsMaxTimeout: configValues.testsMaxTimeout,
  fixerAPIKey: configValues.fixerAPIKey,
  ipStackBaseURL: configValues.ipStackBaseURL,
  ipStackAccessKey: configValues.ipStackAccessKey
}
