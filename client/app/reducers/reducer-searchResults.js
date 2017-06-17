export default (state = null, action) => {
  switch (action.type) {
    case 'FESTIVAL_SEARCH_START':
      return {text: 'Getting event details', color : '#9e425f',status: 'searching'};
      break;
    case 'FLIGHTS_SEARCH_START':
      return {text: 'Looking for flights', color : '#70b280',status: 'searching'};
      break;
    case 'FLIGHTS_SEARCH_FINISH':
      return {text: 'Your flight tickets are ready.', color : '#70b280',status: 'searching'};
      break;
    case 'HOUSING_SEARCH_START':
      return {text: 'Searching for your accommodation.',color: '#4a7689',status: 'searching'};
      break;
    case 'HOUSING_SEARCH_FINISH':
      return {text: 'You\'re all set!',status: 'finished'};
      break;
    case 'FESTIVAL_SEARCH_FINISHED':
      return {results : action.payload,status: 'finished'};
      break;
  }
  return state;
}
