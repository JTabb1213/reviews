var _ = require('lodash');
const Sequelize = require("sequelize");
const db = require("../../../models");
const sequelize = db.sequelize;
db.review = require("../../../models/review.model.js")(sequelize, Sequelize);
const Review = db.review;

async function searchReview(username, ID) {
    try {
        const rev = await Review.findOne({ where: { user_id: username, restaurant_id: ID } });
        // console.log("review found", rev);
        if (rev !== null) {
            return true;
        } else if (rev === null) {
            return false
        }
        //return rev;
    } catch (error) {
        console.error("error searching for review:", error);
    }
}

async function addReview(rating, username, id, review) {
    //console.log(rating, username, id, review);
    const now = new Date().toISOString();
    return Review.create({ rating: rating, user_id: username, restaurant_id: id, review_text: review, createdAt: now, updatedAt: now });
}

async function deleteReview(username, id) {
    try {
        const result = await Review.destroy({ where: { user_id: username, restaurant_id: id } });
        console.log("city was deleted");
        return result;
    } catch (error) {
        console.error("error finding review for deleteing:", error);
    }
}
/*
async function updateWeather(cityId, cityData) {
    try {
        const result = await City.update(cityData, {
            where: { id: cityId },
        });
        return result;
    } catch (error) {
        console.log("error during update", error);
    }
}
*/
/*
async function patchWeather(cityId, cityData) {
    try {
        const oldCity = getWeather(cityId);

        const newCityData = _.merge(oldCity.dataValues, cityData);
        const newCity = updateWeather(cityId, newCityData);

        return newCity;
    } catch (error) {
        console.error("error patching city, ", error);
    }
}
*/

module.exports = {
    addReview: addReview,
    searchReview: searchReview,
    deleteReview: deleteReview
}