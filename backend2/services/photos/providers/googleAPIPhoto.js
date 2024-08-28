
const apiKey = "AIzaSyAXdHdQzOHXknbF2azGqn9ko5cDn4PjA9s";
async function getPhotos(photoReference) {
    try {
        const response = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${apiKey}`
        //console.log(response);
        return response;
    } catch (error) {
        console.log("error getting google photos");
        return null;
    }
}

module.exports = {
    getPhotos: getPhotos
}