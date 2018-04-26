const request = require('request');

const getEventBody = url => {
    return new Promise((resolve, reject) => {
        request(url, (err, resp, body) => {
            if (!err) {
                resolve(body)
            } else {
                reject(`Unable to get html body for "${url}". ${err}`);
            }
        });
    });
}


module.exports = {
    getEventBody
}