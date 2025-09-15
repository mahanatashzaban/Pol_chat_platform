"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authController_1 = require("../controllers/auth/authController");
var authValidators_1 = require("../utils/validators/authValidators");
var router = express_1.default.Router();
// Login route
router.post('/login', authValidators_1.loginValidator, authController_1.AuthController.login);
// Signup route
router.post('/signup', authValidators_1.signupValidator, authController_1.AuthController.signup);
// Get stats (total users, online users)
router.get('/stats', authController_1.AuthController.getStats);
// Password reset route (placeholder)
router.post('/reset-password', authValidators_1.resetPasswordValidator, function (req, res) {
    // TODO: Implement password reset functionality
    res.json({ message: 'لینک بازیابی رمز عبور به ایمیل شما ارسال شد' });
});
exports.default = router;
