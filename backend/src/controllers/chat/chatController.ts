import { Request, Response } from 'express';
import { ChatRoomModel } from '../../models/ChatRoom';
import { MessageModel } from '../../models/Message';
import { UserModel } from '../../models/User';
import { validationResult } from 'express-validator';

export class ChatController {
  static async getRooms(req: Request, res: Response) {
    try {
      const { province, city } = req.query;
      
      let rooms;
      if (province && city) {
        rooms = await ChatRoomModel.findByLocation(province as string, city as string);
      } else {
        rooms = await ChatRoomModel.findAll();
      }

      res.json(rooms);
    } catch (error) {
      console.error('Get rooms error:', error);
      res.status(500).json({ error: 'خطای سرور' });
    }
  }

  static async getRoom(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const room = await ChatRoomModel.findById(parseInt(id));
      
      if (!room) {
        return res.status(404).json({ error: 'اتاق پیدا نشد' });
      }

      res.json(room);
    } catch (error) {
      console.error('Get room error:', error);
      res.status(500).json({ error: 'خطای سرور' });
    }
  }

  static async createRoom(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, description, province, city, maxUsers, isPublic } = req.body;
      const userId = (req as any).user?.userId;

      const room = await ChatRoomModel.create({
        name,
        description,
        province,
        city,
        maxUsers,
        isPublic,
        createdBy: userId
      });

      res.status(201).json(room);
    } catch (error) {
      console.error('Create room error:', error);
      res.status(500).json({ error: 'خطای سرور' });
    }
  }

  static async getMessages(req: Request, res: Response) {
    try {
      const { roomId } = req.params;
      const { limit = 100 } = req.query;

      const messages = await MessageModel.findByRoomId(parseInt(roomId), parseInt(limit as string));
      res.json(messages.reverse()); // Return in chronological order
    } catch (error) {
      console.error('Get messages error:', error);
      res.status(500).json({ error: 'خطای سرور' });
    }
  }

  static async sendMessage(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { roomId } = req.params;
      const { content, messageType } = req.body;
      const userId = (req as any).user?.userId;

      // Verify user is in the room
      const user = await UserModel.findById(userId);
      if (!user || user.currentRoom !== parseInt(roomId)) {
        return res.status(403).json({ error: 'شما در این اتاق نیستید' });
      }

      const message = await MessageModel.create({
        roomId: parseInt(roomId),
        senderId: userId,
        content,
        messageType
      });

      // Update room activity
      await ChatRoomModel.updateUserCount(parseInt(roomId));

      res.status(201).json(message);
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({ error: 'خطای سرور' });
    }
  }

  static async editMessage(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { messageId } = req.params;
      const { content } = req.body;
      const userId = (req as any).user?.userId;

      // Verify message ownership
      const message = await MessageModel.findById(parseInt(messageId));
      if (!message || message.senderId !== userId) {
        return res.status(403).json({ error: 'شما اجازه ویرایش این پیام را ندارید' });
      }

      const updatedMessage = await MessageModel.updateContent(parseInt(messageId), content);
      res.json(updatedMessage);
    } catch (error) {
      console.error('Edit message error:', error);
      res.status(500).json({ error: 'خطای سرور' });
    }
  }

  static async deleteMessage(req: Request, res: Response) {
    try {
      const { messageId } = req.params;
      const userId = (req as any).user?.userId;

      // Verify message ownership
      const message = await MessageModel.findById(parseInt(messageId));
      if (!message || message.senderId !== userId) {
        return res.status(403).json({ error: 'شما اجازه حذف این پیام را ندارید' });
      }

      await MessageModel.delete(parseInt(messageId));
      res.json({ message: 'پیام با موفقیت حذف شد' });
    } catch (error) {
      console.error('Delete message error:', error);
      res.status(500).json({ error: 'خطای سرور' });
    }
  }

  static async joinRoom(req: Request, res: Response) {
    try {
      const { roomId } = req.params;
      const userId = (req as any).user?.userId;

      const room = await ChatRoomModel.findById(parseInt(roomId));
      if (!room) {
        return res.status(404).json({ error: 'اتاق پیدا نشد' });
      }

      // Check room capacity
      if (room.userCount && room.userCount >= room.maxUsers) {
        return res.status(400).json({ error: 'اتاق پر است' });
      }

      // Update user's current room
      await UserModel.updateCurrentRoom(userId, parseInt(roomId));

      res.json({ message: 'با موفقیت به اتاق پیوستید', room });
    } catch (error) {
      console.error('Join room error:', error);
      res.status(500).json({ error: 'خطای سرور' });
    }
  }

  static async leaveRoom(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;

      await UserModel.updateCurrentRoom(userId, null);
      res.json({ message: 'اتاق را ترک کردید' });
    } catch (error) {
      console.error('Leave room error:', error);
      res.status(500).json({ error: 'خطای سرور' });
    }
  }

  static async getRoomUsers(req: Request, res: Response) {
    try {
      const { roomId } = req.params;

      const users = await UserModel.findByRoomId(parseInt(roomId));
      res.json(users);
    } catch (error) {
      console.error('Get room users error:', error);
      res.status(500).json({ error: 'خطای سرور' });
    }
  }
}
