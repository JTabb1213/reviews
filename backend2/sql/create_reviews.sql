-- =============================================================
-- Create the "reviews" table
-- Matches the Sequelize model in models/review.model.js
-- Database: PostgreSQL (Supabase)
-- =============================================================

CREATE TABLE IF NOT EXISTS reviews (
    -- Sequelize default auto-increment primary key
    id              SERIAL          PRIMARY KEY,

    -- Rating stored as a decimal (e.g. 1.0 – 5.0)
    rating          DECIMAL(3, 1)   NOT NULL,

    -- The written review body (use TEXT to allow longer reviews)
    review_text     TEXT,

    -- Username of the reviewer (references users.username)
    user_id         VARCHAR(255)    NOT NULL,

    -- Google Place ID of the restaurant being reviewed
    restaurant_id   VARCHAR(255)    NOT NULL,

    -- Sequelize managed timestamps
    "createdAt"     TIMESTAMP       NOT NULL DEFAULT NOW(),
    "updatedAt"     TIMESTAMP       NOT NULL DEFAULT NOW(),

    -- Enforce one review per user per restaurant
    CONSTRAINT uq_user_restaurant UNIQUE (user_id, restaurant_id),

    -- Optional: tie user_id back to the users table
    CONSTRAINT fk_reviews_user FOREIGN KEY (user_id)
        REFERENCES users (username)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- Index for fetching all reviews for a given restaurant
CREATE INDEX IF NOT EXISTS idx_reviews_restaurant_id ON reviews (restaurant_id);

-- Index for fetching all reviews by a given user
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews (user_id);
