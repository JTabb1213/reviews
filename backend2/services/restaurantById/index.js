const config = require('config');
let _delagate;

const PROVIDERS = {
    GOOGLEMAPAPI: 'googlemapapi'
}

const provider = config.get("providers.map");
_delagate = require('./providers/google');

async function getRestaurantInfoById(id) {
    return _delagate.getRestaurantInfoById.apply(_delagate, arguments);
}
module.exports = {
    getRestaurantInfoById: getRestaurantInfoById
}
