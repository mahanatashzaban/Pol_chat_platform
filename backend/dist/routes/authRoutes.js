"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/auth/authController");
const authValidators_1 = require("../utils/validators/authValidators");
const router = express_1.default.Router();
// Login route
router.post('/login', authValidators_1.loginValidator, authController_1.AuthController.login);
// Signup route
router.post('/signup', authValidators_1.signupValidator, authController_1.AuthController.signup);
// Get stats (total users, online users)
router.get('/stats', authController_1.AuthController.getStats);
// Password reset route (placeholder)
router.post('/reset-password', authValidators_1.resetPasswordValidator, (req, res) => {
    res.json({ message: 'لینک بازیابی رمز عبور به ایمیل شما ارسال شد' });
});
// Verify token route
router.get('/verify', authController_1.AuthController.verifyToken);
// Test route for debugging
router.get('/test', (req, res) => {
    res.json({ message: 'Auth routes are working!' });
});
exports.default = router;
//# sourceMappingURL=authRoutes.js.map