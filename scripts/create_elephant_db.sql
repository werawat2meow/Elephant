-- Run this in pgAdmin Query Tool or psql to create user and database
-- Adjust password before running
-- Create a dedicated DB user (skip if you want to use existing 'postgres' user)
CREATE ROLE elephant_user WITH LOGIN PASSWORD 'ChangeMeStrong!';
-- Create the database owned by the new user
CREATE DATABASE elephant OWNER elephant_user;
-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE elephant TO elephant_user;
-- You can also create extensions if needed, e.g.:
-- \c elephant
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;