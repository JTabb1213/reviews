module.exports = (sequelize, Sequelize) => {
    const Review = sequelize.define("reviews", {
        rating: {
            type: Sequelize.DECIMAL
        },
        review_text: {
            type: Sequelize.STRING
        },
        user_id: {
            type: Sequelize.STRING
        },
        restaurant_id: {
            type: Sequelize.STRING
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false
        }
    }, {
        // Define the primary key for the table
    });

    return Review;
};
