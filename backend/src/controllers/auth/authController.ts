import { Request, Response } from 'express';
import { UserModel } from '../../models/User';
import { PasswordUtils } from '../../utils/helpers/passwordUtils';
import { JwtUtils, JwtPayload } from '../../utils/helpers/jwtUtils';
import { validationResult } from 'express-validator';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      console.log('Login attempt:', req.body.email);
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        console.log('User not found:', email);
        return res.status(401).json({ 
          error: 'ایمیل یا رمز عبور اشتباه است' 
        });
      }

      // Verify password
      const isPasswordValid = await PasswordUtils.comparePassword(password, user.passwordHash);
      if (!isPasswordValid) {
        console.log('Invalid password for:', email);
        return res.status(401).json({ 
          error: 'ایمیل یا رمز عبور اشتباه است' 
        });
      }

      // Update user status
      await UserModel.setOnlineStatus(user.id, true);

      // Generate JWT token
      const tokenPayload: JwtPayload = {
        userId: user.id,
        email: user.email,
        username: user.username
      };

      const token = JwtUtils.generateToken(tokenPayload);

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

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'خطای سرور' });
    }
  }

  static async signup(req: Request, res: Response) {
    try {
      console.log('Signup attempt:', req.body.email);
      
      const errors = validationResult(req);
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
      if (!PasswordUtils.isPasswordStrong(password)) {
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
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        console.log('User already exists:', email);
        return res.status(409).json({
          error: 'کاربر با این ایمیل قبلاً ثبت‌نام کرده است'
        });
      }

      // Generate username from email
      const username = email.split('@')[0];

      // Hash password
      const passwordHash = await PasswordUtils.hashPassword(password);

      // Create user
      const user = await UserModel.create({
        email,
        username,
        fullName,
        passwordHash,
        termsAccepted
      });

      // Generate JWT token
      const tokenPayload: JwtPayload = {
        userId: user.id,
        email: user.email,
        username: user.username
      };

      const token = JwtUtils.generateToken(tokenPayload);

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

    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'خطای سرور' });
    }
  }

  static async getStats(req: Request, res: Response) {
    try {
      const totalUsers = await UserModel.getTotalUsers();
      const onlineUsers = await UserModel.getOnlineUsers();

      res.json({
        totalUsers,
        onlineUsers
      });

    } catch (error) {
      console.error('Stats error:', error);
      res.status(500).json({ error: 'خطای سرور' });
    }
  }

  static async verifyToken(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'توکن ارائه نشده است' });
      }

      const payload = JwtUtils.verifyToken(token);
      const user = await UserModel.findById(payload.userId);
      
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
    } catch (error) {
      res.status(401).json({ error: 'توکن نامعتبر است' });
    }
  }
}
