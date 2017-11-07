export default (state,action) => {
    if (action.type==='EVENT_PRICE_UPDATE') {
        return action.payload;
    } else {
        return false;
    }
}   
    