"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("pg");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var pool = new pg_1.Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});
// Test database connection
pool.on('connect', function () {
    console.log('Connected to PostgreSQL database');
});
pool.on('error', function (err) {
    console.error('Database connection error:', err);
});
exports.default = pool;
