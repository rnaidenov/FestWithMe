export default (state=null,action) => {
  switch (action.type) {
    case 'FESTIVAL_LOOKUP_INPUT':
      return action.payload;
      break;
    }
  return state;
}
