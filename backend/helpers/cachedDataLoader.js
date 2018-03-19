const SearchResults = require('../models/searchResultsModel');


const DataType = {
    EVENT_DETAILS: "event details",
    FLIGHT_DETAILS: "flight details",
    HOUSING_DETAILS: "housing details"
}


const saveEventData = ({ eventName, eventDetails, flightDetails, housingDetails }) => {
    return new Promise((resolve, reject) => {
        SearchResults.create({ eventName, eventDetails, flightDetails, housingDetails }, (err, data) => {
            !err ? resolve(data) : reject(err);
        });
    });
}

const loadEventData = ({ eventName, dataType }) => {
    return new Promise((resolve, reject) => {
        console.log("LOOKING FOR ", dataType, " for ", eventName);
        SearchResults.findOne({ eventName }, (err, data) => {
            if (err) reject(err);
            console.log(data);
            switch (dataType) {
                case DataType.EVENT_DETAILS:
                    setTimeout(() => resolve(data.eventDetails), 1500);
                    break;
                case DataType.FLIGHT_DETAILS:
                    setTimeout(() => resolve(data.flightDetails), 4200);
                    break;
                case DataType.HOUSING_DETAILS:
                    setTimeout(() => resolve(data.housingDetails), 1200);
                    break;    
            }
        })
    });
}



module.exports = {
    DataType,
    saveEventData,
    loadEventData
}