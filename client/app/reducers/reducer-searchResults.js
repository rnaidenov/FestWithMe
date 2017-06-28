export default (state = null, action) => {
  switch (action.type) {
    case 'FESTIVAL_SEARCH_START':
      return {text: 'Getting event details', color : '#4b6677',status: 'searching',loaderValue:10};
      break;
    case 'FLIGHTS_SEARCH_START':
      return {text: `Looking for a ticket to ${action.payload}` , color : '#774d4d',status: 'searching',loaderValue:50};
      break;
    case 'FLIGHTS_SEARCH_FINISH':
      return {text: 'You\'re ready for lift off.', color : '#774d4d',status: 'searching',loaderValue:80};
      break;
    case 'HOUSING_SEARCH_START':
      return {text: 'Just need to find you a comfy bed.',color: '#4c5577',status: 'searching',loaderValue:95};
      break;
    case 'HOUSING_SEARCH_FINISH':
      return {text: 'You\'re all set!',status: 'finished',loaderValue:98};
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
