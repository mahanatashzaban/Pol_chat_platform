"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordValidator = exports.signupValidator = exports.loginValidator = void 0;
const express_validator_1 = require("express-validator");
exports.loginValidator = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('لطفاً یک ایمیل معتبر وارد کنید')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('رمز عبور الزامی است')
        .isLength({ min: 1 })
        .withMessage('رمز عبور نمی‌تواند خالی باشد')
];
exports.signupValidator = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('لطفاً یک ایمیل معتبر وارد کنید')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('رمز عبور باید حداقل ۸ کاراکتر باشد')
        .matches(/[A-Z]/)
        .withMessage('رمز عبور باید شامل حداقل یک حرف بزرگ باشد')
        .matches(/[a-z]/)
        .withMessage('رمز عبور باید شامل حداقل یک حرف کوچک باشد')
        .matches(/[0-9]/)
        .withMessage('رمز عبور باید شامل حداقل یک عدد باشد')
        .matches(/[!@#$%^&*]/)
        .withMessage('رمز عبور باید شامل حداقل یک علامت باشد'),
    (0, express_validator_1.body)('confirmPassword')
        .notEmpty()
        .withMessage('تأیید رمز عبور الزامی است'),
    (0, express_validator_1.body)('fullName')
        .notEmpty()
        .withMessage('نام و نام خانوادگی الزامی است')
        .isLength({ min: 2 })
        .withMessage('نام باید حداقل ۲ کاراکتر باشد'),
    (0, express_validator_1.body)('termsAccepted')
        .isBoolean()
        .withMessage('پذیرش شرایط باید true یا false باشد')
        .equals('true')
        .withMessage('لطفاً شرایط و ضوابط را بپذیرید')
];
exports.resetPasswordValidator = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('لطفاً یک ایمیل معتبر وارد کنید')
        .normalizeEmail()
];
//# sourceMappingURL=authValidators.js.map