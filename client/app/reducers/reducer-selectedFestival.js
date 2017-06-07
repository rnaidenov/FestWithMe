import FestivalReducer from './reducer-festivals';

export default (state = null, action) => {
  
  switch (action.type) {
    case 'FESTIVAL_LOOKUP_SEARCH':
      let festivals = FestivalReducer()
      let { festivalName } = action.payload;

      festivals.forEach(fest => {
        if (fest.festivalName == festivalName) {
          console.log("Festival found." ,fest);
          state = fest;
        }
      })
      break;
  }
  return state;
}
