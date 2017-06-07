const User = require('../models/user');
const bodyParser = require('body-parser');
const airbnb = require('airapi');



module.exports = (app) => {


  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({extended: true}));


  app.get("/api/users",(req, res) => {

    User.find({}, (err, users) => {
      if (err) throw err;
      res.send(users);
    });
  });

  app.get("/api/airbnb",(req,res) => {
    airbnb.search({
     location: 'Sofia, Bulgaria',
     checkin: '07/03/2015',
     checkout: '07/06/2015',
     guests: 2,
     page: 2,
     ib: true
    }).then(function(searchResults) {
      res.send(searchResults)
    });
  })

}
