"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var helmet_1 = require("helmet");
var morgan_1 = require("morgan");
var dotenv_1 = require("dotenv");
var authRoutes_1 = require("./routes/authRoutes");
// Load environment variables
dotenv_1.default.config();
var app = (0, express_1.default)();
var PORT = process.env.PORT || 5000;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/auth', authRoutes_1.default);
// Health check endpoint
app.get('/api/health', function (req, res) {
    res.json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});
// Error handling middleware
app.use(function (err, req, res, next) {
    console.error('Error:', err);
    res.status(500).json({ error: 'خطای سرور' });
});
// 404 handler
app.use('*', function (req, res) {
    res.status(404).json({ error: 'مسیر یافت نشد' });
});
// Start server
app.listen(PORT, function () {
    console.log("\uD83D\uDE80 Server is running on port ".concat(PORT));
    console.log("\uD83D\uDCCA Health check: http://localhost:".concat(PORT, "/api/health"));
    console.log("\uD83D\uDD10 Auth endpoints: http://localhost:".concat(PORT, "/api/auth"));
});
