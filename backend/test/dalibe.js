
const path = require('path');
const fs = require('fs');

const MOCK_DATA_FILEPATH_BASE =  path.resolve(__dirname,'./testData/');

function _getMockResponse(filename) {
    const eventDataPath = path.resolve(MOCK_DATA_FILEPATH_BASE,filename);
    console.log(eventDataPath);
    // return new Promise((resolve, reject) => {
    return fs.readFileSync(eventDataPath, 'utf8');
}

console.log(1+1);
console.log(_getMockResponse('activeEvent.txt'));
console.log(_getMockResponse('activeEvent.txt'));
console.log(2+2);
console.log(2+2);
console.log(2+2);
console.log(2+2);
