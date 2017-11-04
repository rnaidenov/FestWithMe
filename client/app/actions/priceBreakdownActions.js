import { coroutine as co } from 'bluebird';

export function changeCurrency(from, to, details) {
    return (dispatch => {

        const allPricesConverted = [];
        const { flight, ticketPrice, housingDetails, totalPrice } = details;
        
        
        // if (details.converted) {
        //     flight = details.flightDetailsConverted; 
        //     ticketPrice = details.ticketPriceConverted;
        //     housingDetails = details.housingDetailsConverted;
        //     totalPrice = details.totalPriceConverted;
        // }


        co(function* () {
            const ticketPriceRes = yield fetch(`http://localhost:3000/api/currencies/?from=${from}&to=${to}&amount=${ticketPrice}`);
            const { convertedAmount: ticketPriceConverted } = yield ticketPriceRes.json();
            const flightPriceRes = yield fetch(`http://localhost:3000/api/currencies/?from=${from}&to=${to}&amount=${flight.flightPriceAmount}`);
            const { convertedAmount: flightPriceConverted } = yield flightPriceRes.json();
            const flightDetailsConverted = Object.assign({}, flight);
            flightDetailsConverted.flightPriceAmount = flightPriceConverted;
            const housingDetailsConverted = yield convertAccommodationPrices(from,to,housingDetails);
            const totalPriceRes = yield fetch(`http://localhost:3000/api/currencies/?from=${from}&to=${to}&amount=${totalPrice}`);
            const { convertedAmount: totalPriceConverted } = yield totalPriceRes.json();

                dispatch({
                    type: 'CURRENCY_CHANGED',
                    details: {
                        ticketPrice,
                        flightDetails,
                        housingDetails,
                        totalPrice,
                        currencySymbol: to,
                    },
                    isConverted:true
                });

        }).bind(this)();
    });
}

function convertAccommodationPrices(from,to,housingDetails) {
    return new Promise ((resolve, reject) => {
        const convertedPricesResponses = [];
        const convertedPricesJSON = [];
        const housingDetailsConverted = [...housingDetails];
        
        housingDetailsConverted.forEach(property => {
            convertedPricesResponses.push(fetch(`http://localhost:3000/api/currencies/?from=${from}&to=${to}&amount=${property.price}`));
        });

        Promise.all(convertedPricesResponses).then(response => {
            response.forEach(res => {
                convertedPricesJSON.push(res.json());
            });

            Promise.all(convertedPricesJSON).then(convertedPrices => {
                convertedPrices.forEach((newPrice,idx) => {
                    const propertyCopy = Object.assign({},housingDetailsConverted[idx]);
                    propertyCopy.price = newPrice.convertedAmount;
                    housingDetailsConverted[idx] = propertyCopy;
                });
                resolve(housingDetailsConverted);
            })
        })
    });
}