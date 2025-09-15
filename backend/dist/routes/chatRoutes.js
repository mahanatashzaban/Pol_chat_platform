"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatController_1 = require("../controllers/chat/chatController");
const authMiddleware_1 = require("../middleware/auth/authMiddleware");
const chatValidators_1 = require("../utils/validators/chatValidators");
const router = express_1.default.Router();
// Apply auth middleware to all routes
router.use(authMiddleware_1.authMiddleware);
// Room routes
router.get('/rooms', chatController_1.ChatController.getRooms);
router.get('/rooms/:id', chatController_1.ChatController.getRoom);
router.post('/rooms', chatValidators_1.roomValidator, chatController_1.ChatController.createRoom);
router.post('/rooms/:roomId/join', chatController_1.ChatController.joinRoom);
router.post('/rooms/leave', chatController_1.ChatController.leaveRoom);
router.get('/rooms/:roomId/users', chatController_1.ChatController.getRoomUsers);
// Message routes
router.get('/rooms/:roomId/messages', chatController_1.ChatController.getMessages);
router.post('/rooms/:roomId/messages', chatValidators_1.messageValidator, chatController_1.ChatController.sendMessage);
router.put('/messages/:messageId', chatValidators_1.messageValidator, chatController_1.ChatController.editMessage);
router.delete('/messages/:messageId', chatController_1.ChatController.deleteMessage);
exports.default = router;
//# sourceMappingURL=chatRoutes.js.map