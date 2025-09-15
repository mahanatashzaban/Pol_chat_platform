import { Request, Response } from 'express';
import express from 'express';
import { AuthController } from '../controllers/auth/authController';
import { loginValidator, signupValidator, resetPasswordValidator } from '../utils/validators/authValidators';

const router = express.Router();

// Login route
router.post('/login', loginValidator, AuthController.login);

// Signup route
router.post('/signup', signupValidator, AuthController.signup);

// Get stats (total users, online users)
router.get('/stats', AuthController.getStats);

// Password reset route (placeholder)
router.post('/reset-password', resetPasswordValidator, (req: Request, res: Response) => {
  res.json({ message: 'لینک بازیابی رمز عبور به ایمیل شما ارسال شد' });
});

// Verify token route
router.get('/verify', AuthController.verifyToken);

// Test route for debugging
router.get('/test', (req: Request, res: Response) => {
  res.json({ message: 'Auth routes are working!' });
});

export default router;
