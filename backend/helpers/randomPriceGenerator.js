const getEntireHomePrice = (avg_price) => {
    return avg_price +  Math.floor(Math.random() * (avg_price/1.5 - avg_price/2) + avg_price/2);
}

const getPrivateRoomPrice = (avg_price) => {
    const difference =  Math.floor(Math.random() * (avg_price/10 - avg_price/20) + avg_price/20);
    if (Math.random()>0.5) {
        return avg_price + difference;
    } else {
        return avg_price - difference;
    }
}

const getSharedRoomPrice = (avg_price) => {
    return avg_price - Math.floor(Math.random() * (avg_price/1.5 - avg_price/3) + avg_price/3);
}

const getPriceEstimate = (propertyType,avg_price,currency) => {
    if (!avg_price) {
        return null;
    }
    switch(propertyType) {
        case "Shared room":
        return {amount:getSharedRoomPrice(avg_price),currency}
        break;
        case "Private room":
        return {amount:getPrivateRoomPrice(avg_price),currency}
        break;
        case "Entire home":
        return {amount:getEntireHomePrice(avg_price),currency}
        break;
    }
}

module.exports = {
    getPriceEstimate
}
