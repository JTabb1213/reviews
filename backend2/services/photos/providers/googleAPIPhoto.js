
async function getPhotos(photoReference) {
    try {
        const response = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${process.env.GOOGLE_API_KEY}`
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