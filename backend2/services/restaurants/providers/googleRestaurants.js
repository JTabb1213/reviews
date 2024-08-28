const axios = require('axios');
const apiKey = "AIzaSyAXdHdQzOHXknbF2azGqn9ko5cDn4PjA9s";
const location = require('../../location');
const { CityDoesNotExistError } = require('../../../errors');

async function getRestaurants(city, keyword = null, nextPageTokenParam = null, lat = null, lng = null) {
    try {
        let coordinates;

        if (city.toLowerCase() === 'my location') {
            coordinates = { lat, lng };
            console.log("H", lat, lng);
        } else {
            coordinates = await location.getCoordinates(city);
        }

        if (coordinates === null) {
            throw new CityDoesNotExistError(`${city}`);
        }

        let apiURL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates.lat},${coordinates.lng}&radius=5000&type=restaurant&key=${apiKey}` + (nextPageTokenParam ? `&pagetoken=${nextPageTokenParam}` : '');

        if (keyword) {
            apiURL += `&keyword=${encodeURIComponent(keyword)}`;//encode url to include special chars like spaces
        }

        // console.log("Here", coordinates);
        //console.log("API URL:", apiURL);
        const response = await axios.get(apiURL);
        //console.log("res:", response.data);

        //console.log(response.data.results)
        //console.log(response.data.next_page_token)

        const places = response.data.results.map(place => ({
            name: place.name,
            address: place.vicinity,
            id: place.place_id
        }));

        const nextPageToken = response.data.next_page_token;

        const responseData = {
            restaurants: places,
            nextPageToken: response.data.next_page_token
        }
        /*
                if (nextPageToken) {
                    places.push({ nextPageToken });
                }
        */
        return responseData;

    } catch (error) {
        console.error('Error fetching nearby places:', error);
        throw error;
    }
}

module.exports = {
    getRestaurants: getRestaurants
}

///TO GET MORE RESULTS:
/*
try {
        const coordinates = await location.getCoordinates(city);
        let nextPageToken = null;
        let allPlaces = [];

        do {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates.lat},${coordinates.lng}&radius=1500&type=restaurant&key=${apiKey}` +
                (nextPageToken ? `&pagetoken=${nextPageToken}` : '')
            );

            const places = response.data.results.map(place => ({
                name: place.name,
                address: place.vicinity,
                place_id: place.place_id
            }));

            allPlaces = allPlaces.concat(places);
            nextPageToken = response.data.next_page_token;

            // Wait for a few seconds before making the next request
            await new Promise(resolve => setTimeout(resolve, 2000));

        } while (nextPageToken);

        return allPlaces;
    } catch (error) {
        console.error('Error fetching nearby places:', error);
        throw error;
    }
*/