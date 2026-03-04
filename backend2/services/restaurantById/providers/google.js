const axios = require('axios');

async function getRestaurantInfoById(id) {
    try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&key=${process.env.GOOGLE_API_KEY}`
        const response = await axios.get(url);
        //console.log("rr: ", response.data);
        return response.data;
    } catch (error) {
        console.error('Error searching by id', error);
        throw error;
    }
}

module.exports = {
    getRestaurantInfoById: getRestaurantInfoById
}
