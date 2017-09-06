const express = require ('express');
const cors = require('cors');
const mongoose = require ('mongoose');
const config = require ('./config');
const setupController = require('./controllers/setupController');
const apiController = require('./controllers/apiController');
const path = require('path');


const app = express ();
app.use(cors());

var port = process.env.PORT || 3000;

mongoose.connect(config.getDBConnectionString());
setupController(app);
apiController(app);
console.log(path.resolve(__dirname + '../client/dist/'));
app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'../client/dist','index.html'));
});


app.listen(port);
