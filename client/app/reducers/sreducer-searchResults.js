export default (state = null, action) => {
  switch (action.type) {
    case 'FESTIVAL_SEARCH_START1':
      return Object.assign({}, state, {text: 'Getting event details', color : '#b7665d',searching: true,loaderValue:0});
      break;
    case 'FESTIVAL_SEARCH_START2':
      return Object.assign({}, state, {text: 'Getting event details', color : '#b7665d',searching: true,loaderValue:3});
      break;
    case 'FESTIVAL_SEARCH_START3':
      return Object.assign({}, state, {text: 'Getting event details', color : '#b25e55',searching: true,loaderValue:8});
      break;
    case 'FESTIVAL_SEARCH_START4':
      return Object.assign({}, state, {text: 'Getting event details', color : '#b25e55',searching: true,loaderValue:10});
      break;
    case 'FLIGHTS_SEARCH_START1':
      return Object.assign({}, state, {text: `Looking for a ticket to ${action.payload}` , color : '#914037',searching: true,loaderValue:45});
      break;
    case 'FLIGHTS_SEARCH_START2':
      return Object.assign({}, state,  {text: `Looking for a ticket to ${action.payload}` , color : '#914037',searching: true,loaderValue:48});
      break;
    case 'FLIGHTS_SEARCH_START3':
      return Object.assign({}, state, {text: `Looking for a ticket to ${action.payload}` , color : '#7c2f26',searching: true,loaderValue:49});
      break;
    case 'FLIGHTS_SEARCH_START4':
      return Object.assign({}, state, {text: `Looking for a ticket to ${action.payload}` , color : '#7c2f26',searching: true,loaderValue:50});
      break;
    case 'HOUSING_SEARCH_START1':
      return Object.assign({}, state, {text: 'Just need to find you a comfy bed.',color: '#68221a',searching: true,loaderValue:90});
      break;
    case 'HOUSING_SEARCH_START2':
      return Object.assign({}, state, {text: 'Just need to find you a comfy bed.',color: '#68221a',searching: true,loaderValue:92});
      break;
    case 'HOUSING_SEARCH_START3':
      return Object.assign({}, state, {text: 'Just need to find you a comfy bed.',color: '#5b1c15',searching: true,loaderValue:94});
      break;
    case 'HOUSING_SEARCH_START4':
      return Object.assign({}, state, {text: 'Just need to find you a comfy bed.',color: '#5b1c15',searching: true,loaderValue:95});
      break;
    case 'FESTIVAL_SEARCH_FINISHED':
      return Object.assign({}, state, {prices : action.payload,searching: false,loaderValue:100,isActive:true});
      break;
    case 'EVENT_NOT_ACTIVE':
      return Object.assign({}, state, {prices: action.payload, searching: false,loaderValue:100,isActive: false});
      break;
    case 'EVENT_PRICE_UPDATE':
      return Object.assign({}, state, {updatedPrices: action.payload, searching: false,loaderValue:100,isActive:true});
      break;
  }
  return state;
}