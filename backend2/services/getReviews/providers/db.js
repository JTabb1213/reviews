const Sequelize = require("sequelize");
const db = require("../../../models");
const sequelize = db.sequelize;
db.review = require("../../../models/review.model.js")(sequelize, Sequelize);
const Review = db.review;

async function getReviews(id) {
    //console.log(rating, username, id, review);
    const now = new Date().toISOString();
    return Review.findAll({ where: { restaurant_id: id } })
}

module.exports = {
    getReviews: getReviews
}