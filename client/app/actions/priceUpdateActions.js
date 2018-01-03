import { getTotalPrice } from './searchActions';


export function updateTicketPrice(priceDetails, eventPrice) {
  return (dispatch => {
    const { flightDetails, housingDetails } = priceDetails;
    console.log(priceDetails);
    console.log("Event price is: ", eventPrice);
    const eventPriceAmount = parseInt(eventPrice);
    const totalPrice = getTotalPrice({ soldOut: false, price: eventPriceAmount }, flightDetails, housingDetails);
    dispatch({
      type:'EVENT_PRICE_UPDATE',
      payload:{details: totalPrice}
    });
  }); 
}