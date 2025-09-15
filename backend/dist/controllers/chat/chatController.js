"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const ChatRoom_1 = require("../../models/ChatRoom");
const Message_1 = require("../../models/Message");
const User_1 = require("../../models/User");
const express_validator_1 = require("express-validator");
class ChatController {
    static async getRooms(req, res) {
        try {
            const { province, city } = req.query;
            let rooms;
            if (province && city) {
                rooms = await ChatRoom_1.ChatRoomModel.findByLocation(province, city);
            }
            else {
                rooms = await ChatRoom_1.ChatRoomModel.findAll();
            }
            res.json(rooms);
        }
        catch (error) {
            console.error('Get rooms error:', error);
            res.status(500).json({ error: 'خطای سرور' });
        }
    }
    static async getRoom(req, res) {
        try {
            const { id } = req.params;
            const room = await ChatRoom_1.ChatRoomModel.findById(parseInt(id));
            if (!room) {
                return res.status(404).json({ error: 'اتاق پیدا نشد' });
            }
            res.json(room);
        }
        catch (error) {
            console.error('Get room error:', error);
            res.status(500).json({ error: 'خطای سرور' });
        }
    }
    static async createRoom(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { name, description, province, city, maxUsers, isPublic } = req.body;
            const userId = req.user?.userId;
            const room = await ChatRoom_1.ChatRoomModel.create({
                name,
                description,
                province,
                city,
                maxUsers,
                isPublic,
                createdBy: userId
            });
            res.status(201).json(room);
        }
        catch (error) {
            console.error('Create room error:', error);
            res.status(500).json({ error: 'خطای سرور' });
        }
    }
    static async getMessages(req, res) {
        try {
            const { roomId } = req.params;
            const { limit = 100 } = req.query;
            const messages = await Message_1.MessageModel.findByRoomId(parseInt(roomId), parseInt(limit));
            res.json(messages.reverse()); // Return in chronological order
        }
        catch (error) {
            console.error('Get messages error:', error);
            res.status(500).json({ error: 'خطای سرور' });
        }
    }
    static async sendMessage(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { roomId } = req.params;
            const { content, messageType } = req.body;
            const userId = req.user?.userId;
            // Verify user is in the room
            const user = await User_1.UserModel.findById(userId);
            if (!user || user.currentRoom !== parseInt(roomId)) {
                return res.status(403).json({ error: 'شما در این اتاق نیستید' });
            }
            const message = await Message_1.MessageModel.create({
                roomId: parseInt(roomId),
                senderId: userId,
                content,
                messageType
            });
            // Update room activity
            await ChatRoom_1.ChatRoomModel.updateUserCount(parseInt(roomId));
            res.status(201).json(message);
        }
        catch (error) {
            console.error('Send message error:', error);
            res.status(500).json({ error: 'خطای سرور' });
        }
    }
    static async editMessage(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { messageId } = req.params;
            const { content } = req.body;
            const userId = req.user?.userId;
            // Verify message ownership
            const message = await Message_1.MessageModel.findById(parseInt(messageId));
            if (!message || message.senderId !== userId) {
                return res.status(403).json({ error: 'شما اجازه ویرایش این پیام را ندارید' });
            }
            const updatedMessage = await Message_1.MessageModel.updateContent(parseInt(messageId), content);
            res.json(updatedMessage);
        }
        catch (error) {
            console.error('Edit message error:', error);
            res.status(500).json({ error: 'خطای سرور' });
        }
    }
    static async deleteMessage(req, res) {
        try {
            const { messageId } = req.params;
            const userId = req.user?.userId;
            // Verify message ownership
            const message = await Message_1.MessageModel.findById(parseInt(messageId));
            if (!message || message.senderId !== userId) {
                return res.status(403).json({ error: 'شما اجازه حذف این پیام را ندارید' });
            }
            await Message_1.MessageModel.delete(parseInt(messageId));
            res.json({ message: 'پیام با موفقیت حذف شد' });
        }
        catch (error) {
            console.error('Delete message error:', error);
            res.status(500).json({ error: 'خطای سرور' });
        }
    }
    static async joinRoom(req, res) {
        try {
            const { roomId } = req.params;
            const userId = req.user?.userId;
            const room = await ChatRoom_1.ChatRoomModel.findById(parseInt(roomId));
            if (!room) {
                return res.status(404).json({ error: 'اتاق پیدا نشد' });
            }
            // Check room capacity
            if (room.userCount && room.userCount >= room.maxUsers) {
                return res.status(400).json({ error: 'اتاق پر است' });
            }
            // Update user's current room
            await User_1.UserModel.updateCurrentRoom(userId, parseInt(roomId));
            res.json({ message: 'با موفقیت به اتاق پیوستید', room });
        }
        catch (error) {
            console.error('Join room error:', error);
            res.status(500).json({ error: 'خطای سرور' });
        }
    }
    static async leaveRoom(req, res) {
        try {
            const userId = req.user?.userId;
            await User_1.UserModel.updateCurrentRoom(userId, null);
            res.json({ message: 'اتاق را ترک کردید' });
        }
        catch (error) {
            console.error('Leave room error:', error);
            res.status(500).json({ error: 'خطای سرور' });
        }
    }
    static async getRoomUsers(req, res) {
        try {
            const { roomId } = req.params;
            const users = await User_1.UserModel.findByRoomId(parseInt(roomId));
            res.json(users);
        }
        catch (error) {
            console.error('Get room users error:', error);
            res.status(500).json({ error: 'خطای سرور' });
        }
    }
}
exports.ChatController = ChatController;
//# sourceMappingURL=chatController.js.map