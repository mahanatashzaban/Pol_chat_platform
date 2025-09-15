"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageIdValidator = exports.roomIdValidator = exports.messageValidator = exports.roomValidator = void 0;
const express_validator_1 = require("express-validator");
exports.roomValidator = [
    (0, express_validator_1.body)('name')
        .notEmpty()
        .withMessage('نام اتاق الزامی است')
        .isLength({ min: 2, max: 100 })
        .withMessage('نام اتاق باید بین ۲ تا ۱۰۰ کاراکتر باشد'),
    (0, express_validator_1.body)('province')
        .notEmpty()
        .withMessage('استان الزامی است'),
    (0, express_validator_1.body)('city')
        .notEmpty()
        .withMessage('شهر الزامی است'),
    (0, express_validator_1.body)('maxUsers')
        .optional()
        .isInt({ min: 2, max: 1000 })
        .withMessage('حداکثر کاربران باید بین ۲ تا ۱۰۰۰ باشد'),
    (0, express_validator_1.body)('isPublic')
        .optional()
        .isBoolean()
        .withMessage('عمومی بودن باید true یا false باشد')
];
exports.messageValidator = [
    (0, express_validator_1.body)('content')
        .notEmpty()
        .withMessage('متن پیام الزامی است')
        .isLength({ min: 1, max: 1000 })
        .withMessage('پیام باید بین ۱ تا ۱۰۰۰ کاراکتر باشد'),
    (0, express_validator_1.body)('messageType')
        .optional()
        .isIn(['text', 'image', 'file', 'sticker', 'camera'])
        .withMessage('نوع پیام نامعتبر است')
];
exports.roomIdValidator = [
    (0, express_validator_1.param)('roomId')
        .isInt({ min: 1 })
        .withMessage('شناسه اتاق نامعتبر است')
];
exports.messageIdValidator = [
    (0, express_validator_1.param)('messageId')
        .isInt({ min: 1 })
        .withMessage('شناسه پیام نامعتبر است')
];
//# sourceMappingURL=chatValidators.js.map