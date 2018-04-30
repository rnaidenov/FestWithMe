import { getTotalPrice } from './searchActions';

export const updateTicketPrice = (priceDetails, eventPrice, searchDetails) => {
  return (dispatch => {
    const { eventDetails, flightDetails, housingDetails } = priceDetails;
    const { nights, numPeople } = searchDetails;
    Object.assign(eventDetails, { soldOut:false, price: Number(eventPrice) });
    const details = getTotalPrice( eventDetails, flightDetails, housingDetails, nights, numPeople);
    dispatch({
      type:'EVENT_PRICE_UPDATE',
      priceUpdateDetails:details
    });
  }); 
}