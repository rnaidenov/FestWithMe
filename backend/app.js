const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const compression = require('compression');
const config = require('./config');
const setupController = require('./controllers/setupController');
const apiController = require('./controllers/apiController');
const path = require('path');
const MONGO_DB_URL = config.getDBConnectionString();
const app = express();
app.use(cors());

const port = process.env.PORT || 3000;

mongoose.connect(MONGO_DB_URL);
setupController(app);
apiController(app);

app.use(compression());
app.use(express.static(path.join(__dirname + '/', '..', '/client/dist/')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

app.listen(port);
