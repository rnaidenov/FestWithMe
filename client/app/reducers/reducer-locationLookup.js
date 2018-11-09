export default (state='',action) => {

  switch (action.type) {
    case 'SEARCHING_LOCATION_START':
      return 'Looking for your coordinates...'
      break;
    case 'SEARCHING_LOCATION_FINISH':
      return action.location;
      break;
  }
  return state;
}
