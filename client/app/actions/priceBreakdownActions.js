import { coroutine as co } from 'bluebird';

export function changeCurrency(from, to, details) {
    return (dispatch => {

        const allPricesConverted = [];
        const { flightDetails, ticketPrice, housingDetails, totalPrice } = details;

        co(function* () {
            const ticketPriceRes = yield fetch(`http://localhost:3000/api/currencies/?from=${from}&to=${to}&amount=${ticketPrice}`);
            const { convertedAmount: ticketPriceConverted } = yield ticketPriceRes.json();
            const flightPriceRes = yield fetch(`http://localhost:3000/api/currencies/?from=${from}&to=${to}&amount=${flightDetails.flightPriceAmount}`);
            const { convertedAmount: flightPriceConverted } = yield flightPriceRes.json();
            const flightDetailsConverted = Object.assign({}, flightDetails);
            flightDetailsConverted.flightPriceAmount = flightPriceConverted;
            const housingDetailsConverted = yield convertAccommodationPrices(from,to,housingDetails);
            const totalPriceRes = yield fetch(`http://localhost:3000/api/currencies/?from=${from}&to=${to}&amount=${totalPrice}`);
            const { convertedAmount: totalPriceConverted } = yield totalPriceRes.json();
                dispatch({
                    type: 'CURRENCY_CHANGED',
                    details: {
                        ticketPrice: ticketPriceConverted,
                        flightDetails: flightDetailsConverted,
                        housingDetails: housingDetailsConverted,
                        totalPrice: totalPriceConverted,
                        currencySymbol: to,
                    }
                });

        }).bind(this)();
    });
}

function convertAccommodationPrices(from,to,housingDetails) {
    return new Promise ((resolve, reject) => {
        const convertedPricesResponses = [];
        const convertedPricesJSON = [];
        const { properties: housingDetailsConverted, average_price } = housingDetails;
        
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

                fetch(`http://localhost:3000/api/currencies/?from=${from}&to=${to}&amount=${average_price}`).then(res =>{
                    res.json().then(averagePriceConverted => {
                        const convertedDetails = Object.assign({},{properties: housingDetailsConverted, average_price:averagePriceConverted.convertedAmount});
                        resolve(convertedDetails);
                    })
                })
            })
        })
    });
}
