-- =============================================================
-- Create the "users" table
-- Matches the Sequelize model in models/user.model.js
-- Database: PostgreSQL (Supabase)
-- =============================================================

CREATE TABLE IF NOT EXISTS users (
    -- Sequelize default auto-increment primary key
    id          SERIAL          PRIMARY KEY,

    username    VARCHAR(255)    NOT NULL UNIQUE,
    passwrd     VARCHAR(255)    NOT NULL,
    email       VARCHAR(255)    NOT NULL UNIQUE,

    -- Sequelize managed timestamps
    "createdAt" TIMESTAMP       NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- Index on username for fast login lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);

-- Index on email for fast duplicate-check lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
