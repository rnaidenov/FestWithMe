export default (state = [],action) => {
  switch (action.type) {
    case "LOAD_FESTIVALS_START":
      break;
    case "LOAD_FESTIVALS_FINISH":
      let festivalNames = [];
      for (let festival of action.payload) {
        festivalNames.push(festival.name);
      }
      return festivalNames;
      break;
    case "LOAD_FESTIVALS_ERROR":
      return `Error while loading festivals : ${action.payload}`
  }
  return state;
}
