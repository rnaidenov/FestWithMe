export default (state = [],action) => {
  if(action.type==="LOAD_FESTIVALS_FINISH") return action.festivals.map(festival => festival.name);
  return state;
}
