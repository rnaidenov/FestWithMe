const searchFestival = (festivalName) => {
  return {
    type: 'FESTIVAL_LOOKUP_SEARCH',
    payload: festivalName
  }
};

const handleInput = (e) => {
  return {
    type: 'FESTIVAL_LOOKUP_INPUT',
    payload: e.target.value
  }
};

export {
  searchFestival, handleInput
}
