const { APPLICATION_API_BASE_URL } = process.env;

export function changeCurrency(from, to, prices) {
    return (async dispatch => {

        const allPricesConverted = [];
        const { flightDetails, eventDetails , housingDetails, totalPrice } = prices;
        const { convertedAmount: ticketPriceConverted } = await fetch(`${APPLICATION_API_BASE_URL}api/currencies/?from=${from}&to=${to}&amount=${eventDetails.price}`).then(res => res.json());
        Object.assign(eventDetails, { price: ticketPriceConverted });
        const { convertedAmount: flightPriceConverted } = await fetch(`${APPLICATION_API_BASE_URL}api/currencies/?from=${from}&to=${to}&amount=${flightDetails.flightPriceAmount}`).then(res => res.json());
        Object.assign(flightDetails, { flightPriceAmount: flightPriceConverted });
        const housingDetailsConverted = await convertAccommodationPrices(from, to, housingDetails);
        const totalPriceRes = await fetch(`${APPLICATION_API_BASE_URL}api/currencies/?from=${from}&to=${to}&amount=${totalPrice}`);
        const { convertedAmount: totalPriceConverted } = await totalPriceRes.json();
        dispatch({
            type: 'CURRENCY_CHANGED',
            details: {
                eventDetails,
                flightDetails,
                housingDetails: housingDetailsConverted,
                totalPrice: totalPriceConverted,
                currencySymbol: to,
            },
            currency: to
        });
    });
}

async function convertAccommodationPrices(from, to, housingDetails) {
    const { properties, avgPrice: averageAccommodationPrice } = housingDetails;
    properties.forEach(async property => {
        const response = await fetch(`${APPLICATION_API_BASE_URL}api/currencies/?from=${from}&to=${to}&amount=${property.price}`);
        const propertyPrice = await response.json();
        Object.assign(property, { price: propertyPrice.convertedAmount });
    })
    const response = await fetch(`${APPLICATION_API_BASE_URL}api/currencies/?from=${from}&to=${to}&amount=${averageAccommodationPrice}`);
    const avgAccomodationDiffCurrency = await response.json();
    const convertedDetails = Object.assign({}, { properties, avgPrice: avgAccomodationDiffCurrency.convertedAmount });
    return convertedDetails;
}


