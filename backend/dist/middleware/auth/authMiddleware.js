"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwtUtils_1 = require("../../utils/helpers/jwtUtils");
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'دسترسی غیرمجاز. لطفاً وارد شوید.' });
        }
        const payload = jwtUtils_1.JwtUtils.verifyToken(token);
        req.user = payload;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'توکن نامعتبر است' });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map