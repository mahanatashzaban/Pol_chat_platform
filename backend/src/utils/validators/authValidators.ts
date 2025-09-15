import { body } from 'express-validator';

export const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('لطفاً یک ایمیل معتبر وارد کنید')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('رمز عبور الزامی است')
    .isLength({ min: 1 })
    .withMessage('رمز عبور نمی‌تواند خالی باشد')
];

export const signupValidator = [
  body('email')
    .isEmail()
    .withMessage('لطفاً یک ایمیل معتبر وارد کنید')
    .normalizeEmail(),
  
  body('password')
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
  
  body('confirmPassword')
    .notEmpty()
    .withMessage('تأیید رمز عبور الزامی است'),
  
  body('fullName')
    .notEmpty()
    .withMessage('نام و نام خانوادگی الزامی است')
    .isLength({ min: 2 })
    .withMessage('نام باید حداقل ۲ کاراکتر باشد'),
  
  body('termsAccepted')
    .isBoolean()
    .withMessage('پذیرش شرایط باید true یا false باشد')
    .equals('true')
    .withMessage('لطفاً شرایط و ضوابط را بپذیرید')
];

export const resetPasswordValidator = [
  body('email')
    .isEmail()
    .withMessage('لطفاً یک ایمیل معتبر وارد کنید')
    .normalizeEmail()
];
