import express from 'express';
import { ChatController } from '../controllers/chat/chatController';
import { authMiddleware } from '../middleware/auth/authMiddleware';
import { messageValidator, roomValidator } from '../utils/validators/chatValidators';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Room routes
router.get('/rooms', ChatController.getRooms);
router.get('/rooms/:id', ChatController.getRoom);
router.post('/rooms', roomValidator, ChatController.createRoom);
router.post('/rooms/:roomId/join', ChatController.joinRoom);
router.post('/rooms/leave', ChatController.leaveRoom);
router.get('/rooms/:roomId/users', ChatController.getRoomUsers);

// Message routes
router.get('/rooms/:roomId/messages', ChatController.getMessages);
router.post('/rooms/:roomId/messages', messageValidator, ChatController.sendMessage);
router.put('/messages/:messageId', messageValidator, ChatController.editMessage);
router.delete('/messages/:messageId', ChatController.deleteMessage);

export default router;
