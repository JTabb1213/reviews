const config = require('config');
let _delagate;

const PROVIDERS = {
    GOOGLEMAPAPI: 'googlemapapi'
}

const provider = config.get("providers.map");
_delagate = require('./providers/database');
console.log(`Using ${provider} as the map provider`);
async function addReview(rt, u, i, r) {
    //console.log("hh", rt, u, i, r)
    return _delagate.addReview.apply(_delagate, arguments);
}

async function searchReview(username, ID) {
    //console.log("hh", rt, u, i, r)
    return _delagate.searchReview.apply(_delagate, arguments);
}

async function deleteReview(username, id) {
    //console.log("hh", rt, u, i, r)
    return _delagate.deleteReview.apply(_delagate, arguments);
}

module.exports = {
    addReview: addReview,
    searchReview: searchReview,
    deleteReview: deleteReview
}
