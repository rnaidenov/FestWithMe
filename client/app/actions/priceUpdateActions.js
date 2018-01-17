import { getTotalPrice } from './searchActions';

// /eventDetails, flightDetails, housingDetails, nights, numPeople
export const updateTicketPrice = (priceDetails, eventPrice, searchDetails) => {
  return (dispatch => {
    const { flightDetails, housingDetails } = priceDetails;
    const { nights, numPeople } = searchDetails;
    console.log(priceDetails);
    console.log("Event price is: ", eventPrice);
    const eventPriceAmount = parseInt(eventPrice);
    const totalPrice = getTotalPrice({ soldOut: false, price: eventPriceAmount }, flightDetails, housingDetails, nights, numPeople);
    dispatch({
      type:'EVENT_PRICE_UPDATE',
      payload:{details: totalPrice}
    });
  }); 
}