"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
var User_1 = require("../../models/User");
var passwordUtils_1 = require("../../utils/helpers/passwordUtils");
var jwtUtils_1 = require("../../utils/helpers/jwtUtils");
var express_validator_1 = require("express-validator");
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    AuthController.login = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, _a, email, password, user, isPasswordValid, tokenPayload, token, userResponse, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                        }
                        _a = req.body, email = _a.email, password = _a.password;
                        return [4 /*yield*/, User_1.UserModel.findByEmail(email)];
                    case 1:
                        user = _b.sent();
                        if (!user) {
                            return [2 /*return*/, res.status(401).json({
                                    error: 'ایمیل یا رمز عبور اشتباه است'
                                })];
                        }
                        return [4 /*yield*/, passwordUtils_1.PasswordUtils.comparePassword(password, user.passwordHash)];
                    case 2:
                        isPasswordValid = _b.sent();
                        if (!isPasswordValid) {
                            return [2 /*return*/, res.status(401).json({
                                    error: 'ایمیل یا رمز عبور اشتباه است'
                                })];
                        }
                        // Update user status
                        return [4 /*yield*/, User_1.UserModel.setOnlineStatus(user.id, true)];
                    case 3:
                        // Update user status
                        _b.sent();
                        tokenPayload = {
                            userId: user.id,
                            email: user.email,
                            username: user.username
                        };
                        token = jwtUtils_1.JwtUtils.generateToken(tokenPayload);
                        userResponse = {
                            id: user.id,
                            email: user.email,
                            username: user.username,
                            fullName: user.fullName,
                            isOnline: true,
                            lastSeen: user.lastSeen,
                            province: user.province,
                            city: user.city,
                            room: user.currentRoom
                        };
                        res.json({
                            message: 'ورود موفقیت‌آمیز بود',
                            token: token,
                            user: userResponse
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _b.sent();
                        console.error('Login error:', error_1);
                        res.status(500).json({ error: 'خطای سرور' });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.signup = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, _a, email, password, confirmPassword, fullName, termsAccepted, existingUser, username, passwordHash, user, tokenPayload, token, userResponse, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                        }
                        _a = req.body, email = _a.email, password = _a.password, confirmPassword = _a.confirmPassword, fullName = _a.fullName, termsAccepted = _a.termsAccepted;
                        // Check if passwords match
                        if (password !== confirmPassword) {
                            return [2 /*return*/, res.status(400).json({
                                    error: 'رمز عبور و تأیید رمز عبور مطابقت ندارند'
                                })];
                        }
                        // Check password strength
                        if (!passwordUtils_1.PasswordUtils.isPasswordStrong(password)) {
                            return [2 /*return*/, res.status(400).json({
                                    error: 'رمز عبور باید حداقل ۸ کاراکتر شامل حروف بزرگ، کوچک، عدد و علامت باشد'
                                })];
                        }
                        // Check if terms are accepted
                        if (!termsAccepted) {
                            return [2 /*return*/, res.status(400).json({
                                    error: 'لطفاً شرایط و ضوابط را بپذیرید'
                                })];
                        }
                        return [4 /*yield*/, User_1.UserModel.findByEmail(email)];
                    case 1:
                        existingUser = _b.sent();
                        if (existingUser) {
                            return [2 /*return*/, res.status(409).json({
                                    error: 'کاربر با این ایمیل قبلاً ثبت‌نام کرده است'
                                })];
                        }
                        username = email.split('@')[0];
                        return [4 /*yield*/, passwordUtils_1.PasswordUtils.hashPassword(password)];
                    case 2:
                        passwordHash = _b.sent();
                        return [4 /*yield*/, User_1.UserModel.create({
                                email: email,
                                username: username,
                                fullName: fullName,
                                passwordHash: passwordHash,
                                termsAccepted: termsAccepted
                            })];
                    case 3:
                        user = _b.sent();
                        tokenPayload = {
                            userId: user.id,
                            email: user.email,
                            username: user.username
                        };
                        token = jwtUtils_1.JwtUtils.generateToken(tokenPayload);
                        userResponse = {
                            id: user.id,
                            email: user.email,
                            username: user.username,
                            fullName: user.fullName,
                            isOnline: true,
                            lastSeen: user.lastSeen,
                            province: user.province,
                            city: user.city,
                            room: user.currentRoom
                        };
                        res.status(201).json({
                            message: 'حساب کاربری با موفقیت ایجاد شد',
                            token: token,
                            user: userResponse
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _b.sent();
                        console.error('Signup error:', error_2);
                        res.status(500).json({ error: 'خطای سرور' });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.getStats = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var totalUsers, onlineUsers, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, User_1.UserModel.getTotalUsers()];
                    case 1:
                        totalUsers = _a.sent();
                        return [4 /*yield*/, User_1.UserModel.getOnlineUsers()];
                    case 2:
                        onlineUsers = _a.sent();
                        res.json({
                            totalUsers: totalUsers,
                            onlineUsers: onlineUsers
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        console.error('Stats error:', error_3);
                        res.status(500).json({ error: 'خطای سرور' });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return AuthController;
}());
exports.AuthController = AuthController;
