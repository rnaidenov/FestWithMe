const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config');
const setupController = require('./controllers/setupController');
const apiController = require('./controllers/apiController');
const path = require('path');
const MONGO_DB_URL = config.getDBConnectionString();

const app = express();
app.use(cors());

var port = process.env.PORT || 3000;


mongoose.connect(MONGO_DB_URL);
setupController(app);
apiController(app);


app.get('/bundle.js', (req, res, next) => {
    req.url = req.url + '.gz',
        res.set('Content-Encoding', 'gzip');
    next();
});



app.use(express.static(path.join(__dirname + '/', '..', '/client/dist/')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'app.html'));
});

app.listen(port);
