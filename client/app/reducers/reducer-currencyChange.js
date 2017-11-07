export default (state=false,action) => {
    if (action.type==='CURRENCY_CHANGED') {
        return { details: action.details }
    } else {
        if (action.type==='FESTIVAL_SEARCH_START1') {
            state=false;
        }
        return state;
    }
}
