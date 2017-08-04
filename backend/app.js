const express = require ('express');
const cors = require('cors');
const mongoose = require ('mongoose');
const config = require ('./config');
const setupController = require('./controllers/setupController');
const apiController = require('./controllers/apiController');


const app = express ();
app.use(cors());

var port = process.env.PORT || 3000;

mongoose.connect(config.getDBConnectionString());
setupController(app);
apiController(app);

app.listen(port);
