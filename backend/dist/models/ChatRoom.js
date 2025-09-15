"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoomModel = void 0;
const database_1 = __importDefault(require("../config/database"));
class ChatRoomModel {
    static async findAll() {
        const query = `
      SELECT cr.*, 
             COUNT(DISTINCT u.id) as user_count,
             COUNT(DISTINCT CASE WHEN u.is_online THEN u.id END) as online_count
      FROM chat_rooms cr
      LEFT JOIN users u ON u.current_room = cr.id
      WHERE cr.is_public = true
      GROUP BY cr.id
      ORDER BY cr.created_at DESC
    `;
        const result = await database_1.default.query(query);
        return result.rows.map(this.mapRowToChatRoom);
    }
    static async findByLocation(province, city) {
        const query = `
      SELECT cr.*, 
             COUNT(DISTINCT u.id) as user_count,
             COUNT(DISTINCT CASE WHEN u.is_online THEN u.id END) as online_count
      FROM chat_rooms cr
      LEFT JOIN users u ON u.current_room = cr.id
      WHERE cr.province = $1 AND cr.city = $2 AND cr.is_public = true
      GROUP BY cr.id
      ORDER BY cr.created_at DESC
    `;
        const result = await database_1.default.query(query, [province, city]);
        return result.rows.map(this.mapRowToChatRoom);
    }
    static async findById(id) {
        const query = `
      SELECT cr.*, 
             COUNT(DISTINCT u.id) as user_count,
             COUNT(DISTINCT CASE WHEN u.is_online THEN u.id END) as online_count
      FROM chat_rooms cr
      LEFT JOIN users u ON u.current_room = cr.id
      WHERE cr.id = $1
      GROUP BY cr.id
    `;
        const result = await database_1.default.query(query, [id]);
        if (result.rows.length === 0) {
            return null;
        }
        return this.mapRowToChatRoom(result.rows[0]);
    }
    static async create(roomData) {
        const query = `
      INSERT INTO chat_rooms (name, description, province, city, max_users, is_public, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
        const values = [
            roomData.name,
            roomData.description,
            roomData.province,
            roomData.city,
            roomData.maxUsers || 100,
            roomData.isPublic ?? true,
            roomData.createdBy
        ];
        const result = await database_1.default.query(query, values);
        return this.mapRowToChatRoom(result.rows[0]);
    }
    static async updateUserCount(roomId) {
        const query = `
      UPDATE chat_rooms 
      SET updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
        await database_1.default.query(query, [roomId]);
    }
    static async delete(id) {
        const query = 'DELETE FROM chat_rooms WHERE id = $1';
        await database_1.default.query(query, [id]);
    }
    static mapRowToChatRoom(row) {
        return {
            id: row.id,
            name: row.name,
            description: row.description,
            province: row.province,
            city: row.city,
            maxUsers: row.max_users,
            isPublic: row.is_public,
            createdBy: row.created_by,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            userCount: row.user_count,
            onlineCount: row.online_count
        };
    }
}
exports.ChatRoomModel = ChatRoomModel;
//# sourceMappingURL=ChatRoom.js.map