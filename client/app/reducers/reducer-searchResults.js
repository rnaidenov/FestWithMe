export default (state = null, action) => {
  switch (action.type) {
    case 'FESTIVAL_SEARCH_START':
      return 'loading ...';
      break;
    case 'FESTIVAL_SEARCH_FINISHED':
      return action.payload;
      break;
  }
  return state;
}
