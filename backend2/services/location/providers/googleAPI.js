const axios = require('axios');
const apiKey = "AIzaSyAXdHdQzOHXknbF2azGqn9ko5cDn4PjA9s";

async function getCoordinates(city) {
    try {
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${apiKey}`;
        console.log(apiUrl);

        const response = await axios.get(apiUrl);

        if (response.data.results.length > 0 && response.data.results[0].geometry) {
            const location = response.data.results[0].geometry.location;
            const roundedLocation = {
                lat: location.lat,
                lng: location.lng
                // lat: Number(location.lat.toFixed(4)),//round to 4 decimals
                //lng: Number(location.lng.toFixed(4))
            };
            //console.log(roundedLocation);
            return roundedLocation;
        } else {
            console.log('city not found');
            return null;
        }
    } catch (error) {
        console.error('Error getting coordinates:', error);

        if (error.response && error.response.status === 404) {
            console.log('city was not found');
            return null
        }

        throw error;
    }
}

module.exports = {
    getCoordinates: getCoordinates,
};

