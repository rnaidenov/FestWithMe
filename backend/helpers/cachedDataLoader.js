const SearchResults = require('../models/searchResultsModel');


const DataType = {
    EVENT_DETAILS: "event details",
    FLIGHT_DETAILS: "flight details",
    HOUSING_DETAILS: "housing details"
}


// Creates documents correspnding to each result type 

// const createResultTypesInDB = () => {
//     [DataType.FLIGHT_DETAILS, DataType.HOUSING_DETAILS, DataType.EVENT_DETAILS].map(type => SearchResults.create({ type, data: []}));
// }

// createResultTypesInDB();

const _isDataCached = ({ type, data }) => {
    return new Promise((resolve, reject) => {
        SearchResults.findOne({ type }, (err, caches) => {
            switch (type) {
                case DataType.EVENT_DETAILS:
                    resolve(_isFestivalCached(caches.data,data));
                case DataType.FLIGHT_DETAILS:
                    resolve(_areFlightDetailsCached(caches.data,data));
                case DataType.HOUSING_DETAILS:
                    resolve(_areHousingDetailsCached(caches.data,data));
            }
        });
    });
}

const _isFestivalCached = (cachedData, newFestivalData) => {
    for(data of cachedData){
        if (data.name === newFestivalData.name) return true;
    }
    return false;
}


const _areFlightDetailsCached = (cachedData, newFlightDetails) => {
    for(data of cachedData){
        if (data.origin === newFlightDetails.origin && data.destination === newFlightDetails.destination) return true;
    }
    return false;
}


const _areHousingDetailsCached = (cachedData, newHousingDetails) => {
    for(data of cachedData){
        if (data.date === newHousingDetails.date && data.numPeople === newHousingDetails.numPeople && data.destination === newHousingDetails.destination) return true;
    }
    return false;
}

const cacheResults = ({ type, data }) => {
    return new Promise(async (resolve, reject) => {
        const isCached = await _isDataCached({ type, data });
        if (!isCached) SearchResults.findOneAndUpdate({ type }, { $push: { data } }, (err, data) => { !err ? resolve() : reject(err) });
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
            const cachedEventResult = cachedDetails.data.find(data => data.name.includes(eventName));
            setTimeout(() => resolve(cachedEventResult), 1500);
        })
    });
}

const loadCachedFlightResult = (origin, destination) => {
    console.log("LOADING FLIGHT CACHED RESULTS.");

    console.log(`Looking for origin "${origin} and destination "${destination}" ...`);

    return new Promise((resolve, reject) => {
        SearchResults.findOne({ type: DataType.FLIGHT_DETAILS }, (err, cachedDetails) => {
            const cachedFlightResult = cachedDetails.data.find(data => data.origin.includes(origin) && data.destination.includes(destination));
            console.log("GIVING BACK CACHED FLIGHT RESULT");
            console.log(cachedFlightResult)
            setTimeout(() => resolve(cachedFlightResult.flightPriceDetails), 4200);
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