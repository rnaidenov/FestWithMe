export function changeCurrency(from, to, prices) {
    return (async dispatch => {

        const allPricesConverted = [];
        const { flightDetails, ticketPrice, housingDetails, totalPrice } = prices;
        const { convertedAmount: ticketPriceConverted } =   await fetch(`http://localhost:3000/api/currencies/?from=${from}&to=${to}&amount=${ticketPrice}`).then(res => res.json());
        const { convertedAmount: flightPriceConverted } =  await fetch(`http://localhost:3000/api/currencies/?from=${from}&to=${to}&amount=${flightDetails.flightPriceAmount}`).then(res => res.json());
        Object.assign(flightDetails, {flightPriceAmount:flightPriceConverted});
       
        const housingDetailsConverted = await convertAccommodationPrices(from,to,housingDetails);
        const totalPriceRes = await fetch(`http://localhost:3000/api/currencies/?from=${from}&to=${to}&amount=${totalPrice}`);
        const { convertedAmount: totalPriceConverted } = await totalPriceRes.json();
            dispatch({
                type: 'CURRENCY_CHANGED',
                details: {
                    ticketPrice: ticketPriceConverted,
                    flightDetails,
                    housingDetails: housingDetailsConverted,
                    totalPrice: totalPriceConverted,
                    currencySymbol: to,
                },
                currency: to
            });     
    });
}

async function convertAccommodationPrices(from,to,housingDetails) {
    const { properties, average_price } = housingDetails;
    properties.forEach(async property => {
        const response = await fetch(`http://localhost:3000/api/currencies/?from=${from}&to=${to}&amount=${property.price}`);
        const propertyPrice = await response.json();
        Object.assign(property,{price:propertyPrice.convertedAmount});
    })
    const response = await fetch(`http://localhost:3000/api/currencies/?from=${from}&to=${to}&amount=${average_price}`);
    const avgPrice = await response.json();
    const convertedDetails = Object.assign({},{properties, average_price: avgPrice.convertedAmount});
    return convertedDetails;
}


