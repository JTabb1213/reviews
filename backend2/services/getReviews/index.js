const config = require('config');
let _delagate;

const PROVIDERS = {
    GOOGLEMAPAPI: 'googlemapapi'
}

const provider = config.get("providers.map");
_delagate = require('./providers/db');
console.log(`Using ${provider} as the map provider`);
async function getReviews(id) {
    // console.log("hh", id)
    return _delagate.getReviews.apply(_delagate, arguments);
}

module.exports = {
    getReviews: getReviews
}