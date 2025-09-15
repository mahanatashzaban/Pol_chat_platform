"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const User_1 = require("../../models/User");
const passwordUtils_1 = require("../../utils/helpers/passwordUtils");
const jwtUtils_1 = require("../../utils/helpers/jwtUtils");
const express_validator_1 = require("express-validator");
class AuthController {
    static async login(req, res) {
        try {
            console.log('Login attempt:', req.body.email);
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                console.log('Validation errors:', errors.array());
                return res.status(400).json({ errors: errors.array() });
            }
            const { email, password } = req.body;
            // Find user by email
            const user = await User_1.UserModel.findByEmail(email);
            if (!user) {
                console.log('User not found:', email);
                return res.status(401).json({
                    error: 'ایمیل یا رمز عبور اشتباه است'
                });
            }
            // Verify password
            const isPasswordValid = await passwordUtils_1.PasswordUtils.comparePassword(password, user.passwordHash);
            if (!isPasswordValid) {
                console.log('Invalid password for:', email);
                return res.status(401).json({
                    error: 'ایمیل یا رمز عبور اشتباه است'
                });
            }
            // Update user status
            await User_1.UserModel.setOnlineStatus(user.id, true);
            // Generate JWT token
            const tokenPayload = {
                userId: user.id,
                email: user.email,
                username: user.username
            };
            const token = jwtUtils_1.JwtUtils.generateToken(tokenPayload);
            // Return user data (excluding password)
            const userResponse = {
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
            console.log('Login successful:', user.email);
            res.json({
                message: 'ورود موفقیت‌آمیز بود',
                token,
                user: userResponse
            });
        }
        catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'خطای سرور' });
        }
    }
    static async signup(req, res) {
        try {
            console.log('Signup attempt:', req.body.email);
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                console.log('Validation errors:', errors.array());
                return res.status(400).json({ errors: errors.array() });
            }
            const { email, password, confirmPassword, fullName, termsAccepted } = req.body;
            // Check if passwords match
            if (password !== confirmPassword) {
                console.log('Password mismatch');
                return res.status(400).json({
                    error: 'رمز عبور و تأیید رمز عبور مطابقت ندارند'
                });
            }
            // Check password strength
            if (!passwordUtils_1.PasswordUtils.isPasswordStrong(password)) {
                console.log('Weak password');
                return res.status(400).json({
                    error: 'رمز عبور باید حداقل ۸ کاراکتر شامل حروف بزرگ، کوچک، عدد و علامت باشد'
                });
            }
            // Check if terms are accepted
            if (!termsAccepted) {
                console.log('Terms not accepted');
                return res.status(400).json({
                    error: 'لطفاً شرایط و ضوابط را بپذیرید'
                });
            }
            // Check if user already exists
            const existingUser = await User_1.UserModel.findByEmail(email);
            if (existingUser) {
                console.log('User already exists:', email);
                return res.status(409).json({
                    error: 'کاربر با این ایمیل قبلاً ثبت‌نام کرده است'
                });
            }
            // Generate username from email
            const username = email.split('@')[0];
            // Hash password
            const passwordHash = await passwordUtils_1.PasswordUtils.hashPassword(password);
            // Create user
            const user = await User_1.UserModel.create({
                email,
                username,
                fullName,
                passwordHash,
                termsAccepted
            });
            // Generate JWT token
            const tokenPayload = {
                userId: user.id,
                email: user.email,
                username: user.username
            };
            const token = jwtUtils_1.JwtUtils.generateToken(tokenPayload);
            // Return user data (excluding password)
            const userResponse = {
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
            console.log('Signup successful:', user.email);
            res.status(201).json({
                message: 'حساب کاربری با موفقیت ایجاد شد',
                token,
                user: userResponse
            });
        }
        catch (error) {
            console.error('Signup error:', error);
            res.status(500).json({ error: 'خطای سرور' });
        }
    }
    static async getStats(req, res) {
        try {
            const totalUsers = await User_1.UserModel.getTotalUsers();
            const onlineUsers = await User_1.UserModel.getOnlineUsers();
            res.json({
                totalUsers,
                onlineUsers
            });
        }
        catch (error) {
            console.error('Stats error:', error);
            res.status(500).json({ error: 'خطای سرور' });
        }
    }
    static async verifyToken(req, res) {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                return res.status(401).json({ error: 'توکن ارائه نشده است' });
            }
            const payload = jwtUtils_1.JwtUtils.verifyToken(token);
            const user = await User_1.UserModel.findById(payload.userId);
            if (!user) {
                return res.status(401).json({ error: 'کاربر یافت نشد' });
            }
            res.json({
                valid: true,
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    fullName: user.fullName,
                    isOnline: user.isOnline,
                    lastSeen: user.lastSeen,
                    province: user.province,
                    city: user.city,
                    room: user.currentRoom
                }
            });
        }
        catch (error) {
            res.status(401).json({ error: 'توکن نامعتبر است' });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map