const axios = require('axios');
const apiKey = "AIzaSyAXdHdQzOHXknbF2azGqn9ko5cDn4PjA9s";

async function getRestaurantInfoById(id) {
    try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&key=${apiKey}`
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
