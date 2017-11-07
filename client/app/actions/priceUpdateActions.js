import { getTotalPrice } from './searchActions';


export function updateTicketPrice(priceDetails, eventPrice) {
  return (dispatch => {
    const { flightDetails, housingDetails } = priceDetails;
    const totalPrice = getTotalPrice({ soldOut: false, price: eventPrice}, flightDetails, housingDetails);
    console.log(housingDetails);
    dispatch({
      type:'EVENT_PRICE_UPDATE',
      payload:{details: totalPrice}
    });
  }); 
}