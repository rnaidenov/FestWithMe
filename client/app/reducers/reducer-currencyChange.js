export default (state=false,action) => {
    if (action.type=='CURRENCY_CHANGED') {
        return {
            details: action.details
        }
    }
    return state;
}
