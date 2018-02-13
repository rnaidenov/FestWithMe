import { getTotalPrice } from './searchActions';

export const updateTicketPrice = (priceDetails, eventPrice, searchDetails) => {
  return (dispatch => {
    const { flightDetails, housingDetails } = priceDetails;
    const { nights, numPeople } = searchDetails;
    const eventPriceAmount = parseInt(eventPrice);
    const details = getTotalPrice({ soldOut: false, price: eventPriceAmount }, flightDetails, housingDetails, nights, numPeople);
    dispatch({
      type:'EVENT_PRICE_UPDATE',
      priceUpdateDetails:details
    });
  }); 
}