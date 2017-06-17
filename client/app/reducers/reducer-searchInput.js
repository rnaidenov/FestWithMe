export default (state=null,action) => {
  switch (action.type) {
    case 'FESTIVAL_INPUT_UPDATE':
      return action.payload;
      break;
    }
  return state;
}
