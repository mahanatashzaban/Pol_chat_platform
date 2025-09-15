"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtUtils = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var JwtUtils = /** @class */ (function () {
    function JwtUtils() {
    }
    JwtUtils.generateToken = function (payload) {
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        });
    };
    JwtUtils.verifyToken = function (token) {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    };
    JwtUtils.decodeToken = function (token) {
        return jsonwebtoken_1.default.decode(token);
    };
    return JwtUtils;
}());
exports.JwtUtils = JwtUtils;
