const Festivals = require('../models/festivalModel');

const saveIfNotExist = ({ name, date }) => {
    Festivals.findOne({ name }, (err, festival) => {
        if (!festival) {
            Festivals.create({ name, date });
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

const removePastEvents = () => {
    return new Promise((resolve, reject) => {
        Festivals.find({}, (err, allFestivals) => {
            allFestivals.map(festival => {
                const festivalDate = new Date(festival.date);
                const todaysDate = new Date();
                if (festivalDate < todaysDate) _removeEvent(festival.name);
            })
            resolve();
        });
    });
}

const _removeEvent = (name) => {
    Festivals.remove({ name }, (err) => {
        if (err) throw new Error(`Something went wrong when trying to delete festival ${name}. Mongo error: ${err}`);
    });
}

module.exports = {
    saveIfNotExist,
    getSavedEvents,
    removePastEvents
}