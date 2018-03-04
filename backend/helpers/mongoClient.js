const Festivals = require('../models/festivalModel');

const saveIfNotExist = (eventName) => {
    Festivals.findOne({ name:eventName }, (err, festival) => {
        if (!festival) {
            Festivals.create({ name:eventName });
        }
    });
}

const getSavedEvents = () => {
    return new Promise((resolve, reject) => {
        Festivals.find({}, (err, festivals) => {
            err ? reject(err) : resolve(festivals)
        });
    });
}


module.exports = {
    saveIfNotExist,
    getSavedEvents
}