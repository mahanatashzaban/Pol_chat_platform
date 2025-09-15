import { body, param } from 'express-validator';

export const roomValidator = [
  body('name')
    .notEmpty()
    .withMessage('نام اتاق الزامی است')
    .isLength({ min: 2, max: 100 })
    .withMessage('نام اتاق باید بین ۲ تا ۱۰۰ کاراکتر باشد'),
  
  body('province')
    .notEmpty()
    .withMessage('استان الزامی است'),
  
  body('city')
    .notEmpty()
    .withMessage('شهر الزامی است'),
  
  body('maxUsers')
    .optional()
    .isInt({ min: 2, max: 1000 })
    .withMessage('حداکثر کاربران باید بین ۲ تا ۱۰۰۰ باشد'),
  
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('عمومی بودن باید true یا false باشد')
];

export const messageValidator = [
  body('content')
    .notEmpty()
    .withMessage('متن پیام الزامی است')
    .isLength({ min: 1, max: 1000 })
    .withMessage('پیام باید بین ۱ تا ۱۰۰۰ کاراکتر باشد'),
  
  body('messageType')
    .optional()
    .isIn(['text', 'image', 'file', 'sticker', 'camera'])
    .withMessage('نوع پیام نامعتبر است')
];

export const roomIdValidator = [
  param('roomId')
    .isInt({ min: 1 })
    .withMessage('شناسه اتاق نامعتبر است')
];

export const messageIdValidator = [
  param('messageId')
    .isInt({ min: 1 })
    .withMessage('شناسه پیام نامعتبر است')
];
