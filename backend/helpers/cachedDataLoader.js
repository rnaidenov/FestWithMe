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

// Check if data is already in the database before caching it 
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
    // TODO: Integrate with actual API
    const data = {
        properties: [
            {
                type: "Shared room",
                icon: "sharedRoom.svg",
                price: 40
            },
            {
                type: "Private room",
                icon: "privateRoom.svg",
                price: 60
            },
            {
                type: "Entire home/apt",
                icon: "entireHome.svg",
                price: 80
            },
        ],
        avgPrice: 60,
        url: "https://www.airbnb.co.uk/s/London--England--United-Kingdom/homes?adults=2&place_id=ChIJdd4hrwug2EcRmSrV3Vo6llI&checkin=2022-06-04&checkout=2022-06-06"
    }
  
    return Promise.resolve(data)

    // return new Promise((resolve, reject) => {
    //     SearchResults.findOne({ type: DataType.HOUSING_DETAILS }, (err, cachedDetails) => {
    //         const cachedHousingResult = cachedDetails.data.find(data => data.destination == destination && data.numPeople == numPeople && data.date == date);  
    //         setTimeout(() => resolve(cachedHousingResult.housingDetails), 400);
    //     })
    // });
}

const loadCachedEventResult = (eventName) => {
    console.log(1);
    const eventDetails = {
        name: 'Junction 2 Festival 2018',
        city: 'London',
        country: 'United Kingdom',
        date: '9 Jun 2018',
        price: 80,
        isActive: true,
        url: "https://ra.co/events/1326047"
    }
    return eventDetails;

    // return new Promise((resolve, reject) => {
    //     SearchResults.findOne({ type: DataType.EVENT_DETAILS }, (err, cachedDetails) => {
    //         console.log({ cachedDetails })
    //         const cachedEventResult = cachedDetails.data.find(data => data.name.includes(eventName));
    //         setTimeout(() => resolve(cachedEventResult), 100);
    //     })
    // });
}

const loadCachedFlightResult = (origin, destination) => {
    // TODO: Integrate the below with the actual API
    const data = {
        flightPriceAmount: 100,
        origin: "SOF",
        destination: "LON",
        url: "https://www.kiwi.com/en/search/results/sofia-bulgaria/london-united-kingdom/2022-06-04/2022-06-06"
      };
    return Promise.resolve(data);

    // return new Promise((resolve, reject) => {
    //     SearchResults.findOne({ type: DataType.FLIGHT_DETAILS }, (err, cachedDetails) => {
    //         const cachedFlightResult = cachedDetails.data.find(data => data.origin.includes(origin) && data.destination.includes(destination));
    //         setTimeout(() => resolve(cachedFlightResult.flightPriceDetails), 300);
    //     })
    // });
}



module.exports = {
    DataType,
    cacheResults,
    loadCachedEventResult,
    loadCachedFlightResult,
    loadCachedHousingResult
}