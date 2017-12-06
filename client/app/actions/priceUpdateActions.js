import { getTotalPrice } from './searchActions';


export function updateTicketPrice(priceDetails, eventPrice) {
  return (dispatch => {
    console.log(priceDetails)
    const { flightDetails, housingDetails } = priceDetails;
    const totalPrice = getTotalPrice({ soldOut: false, price: eventPrice}, flightDetails, housingDetails);
    dispatch({
      type:'EVENT_PRICE_UPDATE',
      payload:{details: totalPrice}
    });
  }); 
}