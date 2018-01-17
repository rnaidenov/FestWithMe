export default (state = null, action) => {
  switch (action.type) {
    case 'FESTIVAL_SEARCH_START':
      console.log("FESTIVAL_SEARCH_START");
      return Object.assign({}, state, { text: 'Getting event details', color: '#b7665d', searching: true, searchDetails: action.search });
    case 'FLIGHTS_SEARCH_START':
      return Object.assign({}, state, { text: `Looking for a ticket to ${action.destination}`, color: '#914037', searching: true });
    case 'HOUSING_SEARCH_START':
      return Object.assign({}, state, { text: 'Just need to find you a comfy bed.', color: '#68221a', searching: true });
    case 'FESTIVAL_SEARCH_FINISHED':
      return Object.assign({}, state, { loaderValue: 100, prices: action.payload, searching: false, loaderValue: 100, isActive: true });
    case 'EVENT_NOT_ACTIVE':
      return Object.assign({}, state, { prices: action.payload, searching: false, loaderValue: 100, isActive: false });
    case 'EVENT_PRICE_UPDATE':
      return Object.assign({}, state, { loaderValue: 100, updatedPrices: action.payload, searching: false, loaderValue: 100, isActive: true });
    case 'INCREASE_LOADER':
      return Object.assign({}, state, { loaderValue: action.loaderValue });
  }
  return state;
}
