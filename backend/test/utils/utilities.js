const fs = require('fs');
const path = require('path');
const MOCK_DATA_FILEPATH_BASE = path.resolve(__dirname, '../testData/');


function getMockResponse(filename) {
    const eventDataPath = path.resolve(MOCK_DATA_FILEPATH_BASE, filename);
    return fs.readFileSync(eventDataPath, 'utf8');
}


function getDate(change) {
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const todaysDate = new Date();
    let day = todaysDate.getDate();
    if (change) {
        const { days } = change;
        const { moreDays, amount } = days;
        if (days.moreDays) {
            todaysDate.setDate(day + amount);
        } else {
            todaysDate.setDate(day - amount);
        }
        day = todaysDate.getDate();
    }
    const month = todaysDate.getMonth();
    const year = todaysDate.getFullYear();
    return `${day} ${monthNames[month]} ${year}`;
}

module.exports = {
    getDate,
    getMockResponse
}