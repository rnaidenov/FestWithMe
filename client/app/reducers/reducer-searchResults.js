export default (state = null, action) => {
  console.log("ACTION IS : " + action.type);
  switch (action.type) {
    case 'FESTIVAL_SEARCH_START1':
      return {text: 'Getting event details', color : '#b7665d',status: 'searching',loaderValue:0};
      break;
    case 'FESTIVAL_SEARCH_START2':
      return {text: 'Getting event details', color : '#b7665d',status: 'searching',loaderValue:3};
      break;
    case 'FESTIVAL_SEARCH_START3':
      return {text: 'Getting event details', color : '#b25e55',status: 'searching',loaderValue:8};
      break;
    case 'FESTIVAL_SEARCH_START4':
      return {text: 'Getting event details', color : '#b25e55',status: 'searching',loaderValue:10};
      break;
    case 'FLIGHTS_SEARCH_START1':
      return {text: `Looking for a ticket to ${action.payload}` , color : '#914037',status: 'searching',loaderValue:45};
      break;
    case 'FLIGHTS_SEARCH_START2':
      return {text: `Looking for a ticket to ${action.payload}` , color : '#914037',status: 'searching',loaderValue:48};
      break;
    case 'FLIGHTS_SEARCH_START3':
      return {text: `Looking for a ticket to ${action.payload}` , color : '#7c2f26',status: 'searching',loaderValue:49};
      break;
    case 'FLIGHTS_SEARCH_START4':
      return {text: `Looking for a ticket to ${action.payload}` , color : '#7c2f26',status: 'searching',loaderValue:50};
      break;
    case 'HOUSING_SEARCH_START1':
      return {text: 'Just need to find you a comfy bed.',color: '#68221a',status: 'searching',loaderValue:90};
      break;
    case 'HOUSING_SEARCH_START2':
      return {text: 'Just need to find you a comfy bed.',color: '#68221a',status: 'searching',loaderValue:92};
      break;
    case 'HOUSING_SEARCH_START3':
      return {text: 'Just need to find you a comfy bed.',color: '#5b1c15',status: 'searching',loaderValue:94};
      break;
    case 'HOUSING_SEARCH_START4':
      return {text: 'Just need to find you a comfy bed.',color: '#5b1c15',status: 'searching',loaderValue:95};
      break;
    case 'FESTIVAL_SEARCH_FINISHED':
      return {prices : action.payload,status: 'finished',loaderValue:100};
      break;
    case 'EVENT_SOLD_OUT':
      return {prices : action.payload,status: 'finished',loaderValue:100};
      break;
  }
  return state;
}
