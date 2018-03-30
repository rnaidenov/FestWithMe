const SearchResults = require('../models/searchResultsModel');


const DataType = {
    EVENT_DETAILS: "event details",
    FLIGHT_DETAILS: "flight details",
    HOUSING_DETAILS: "housing details"
}

// const what = () => {
//     [DataType.FLIGHT_DETAILS, DataType.HOUSING_DETAILS, DataType.EVENT_DETAILS].map(type => SearchResults.create({ type, data: []}));
// }

// what();


const cacheResults = ({ type, data }) => {
    return new Promise((resolve, reject) => {
        SearchResults.findOneAndUpdate({ type }, { $push: { data } }, (err, data) => { !err ? resolve() : reject(err) })
    });
}

const loadCachedHousingResult = (destination, date, numPeople) => {
    return new Promise((resolve, reject) => {
        SearchResults.findOne({ type: DataType.HOUSING_DETAILS }, (err, cachedDetails) => {
            const cachedHousingResult = cachedDetails.data.find(data => data.destination == destination && data.numPeople == numPeople && data.date == date);  
            setTimeout(() => resolve(cachedHousingResult.housingDetails), 400);
        })
    });
}

const loadCachedEventResult = (eventName) => {
    console.log("LOOKING FOR ", eventName);
    return new Promise((resolve, reject) => {
        SearchResults.findOne({ type: DataType.EVENT_DETAILS }, (err, cachedDetails) => {
            const cachedEventResult = cachedDetails.data.find(data => data.eventDetails.name.includes(eventName));
            console.log("GIVING BACK CACHED EVENT RESULT");
            setTimeout(() => resolve(cachedEventResult.eventDetails), 1500);
        })
    });
}

const loadCachedFlightResult = (origin, destination) => {
    return new Promise((resolve, reject) => {
        SearchResults.findOne({ type: DataType.FLIGHT_DETAILS }, (err, cachedDetails) => {
            const cachedFlightResult = cachedDetails.data.find(data => data.origin == origin && data.destination == destination);
            console.log("GIVING BACK CACHED FLIGHT RESULT");
            setTimeout(() => resolve(cachedFlightResult.flightDetails), 4200);
        })
    });
}



module.exports = {
    DataType,
    cacheResults,
    loadCachedEventResult,
    loadCachedFlightResult,
    loadCachedHousingResult
}