const DEFAULT_CURRENCY_SYMBOL = '€';

export default (state = { currency: DEFAULT_CURRENCY_SYMBOL, searching: false }, action) => {
  switch (action.type) {
    case 'FESTIVAL_SEARCH_START':
      return Object.assign({}, state, { text: 'Getting event details ...', color: '#b7665d', searching: true, searchDetails: action.search });
    case 'FLIGHTS_SEARCH_START':
      return Object.assign({}, state, { text: `Looking for a ticket to ${action.destination} ...`, color: '#914037' });
    case 'HOUSING_SEARCH_START':
      return Object.assign({}, state, { text: 'Just need to find you a comfy bed ...', color: '#68221a' });
    case 'FESTIVAL_SEARCH_FINISHED':
      return Object.assign({}, state, { loaderValue: 100, prices: action.priceDetails, searching: false, loaderValue: 100, isActive: true });
    case 'EVENT_NOT_ACTIVE':
      return Object.assign({}, state, { searching: false, loaderValue: 100, isActive: false });
    case 'EVENT_PRICE_UPDATE':
      return Object.assign({}, state, { prices: action.priceUpdateDetails });
    case 'INCREASE_LOADER':
      return Object.assign({}, state, { loaderValue: action.loaderValue });
    case 'CURRENCY_CHANGED':
      return Object.assign({}, state, { prices: action.details, currency:action.currency });
      break;
  }
  return state;
}
