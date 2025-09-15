"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const database_1 = __importDefault(require("../config/database"));
class UserModel {
    static async create(userData) {
        const query = `
      INSERT INTO users (email, username, full_name, password_hash, terms_accepted)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
        const values = [
            userData.email,
            userData.username,
            userData.fullName,
            userData.passwordHash,
            userData.termsAccepted
        ];
        const result = await database_1.default.query(query, values);
        return this.mapRowToUser(result.rows[0]);
    }
    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await database_1.default.query(query, [email]);
        if (result.rows.length === 0) {
            return null;
        }
        return this.mapRowToUser(result.rows[0]);
    }
    static async findById(id) {
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await database_1.default.query(query, [id]);
        if (result.rows.length === 0) {
            return null;
        }
        return this.mapRowToUser(result.rows[0]);
    }
    static async updateLastSeen(userId) {
        const query = 'UPDATE users SET last_seen = CURRENT_TIMESTAMP WHERE id = $1';
        await database_1.default.query(query, [userId]);
    }
    static async setOnlineStatus(userId, isOnline) {
        const query = 'UPDATE users SET is_online = $1, last_seen = CURRENT_TIMESTAMP WHERE id = $2';
        await database_1.default.query(query, [isOnline, userId]);
    }
    static async getTotalUsers() {
        const query = 'SELECT COUNT(*) FROM users';
        const result = await database_1.default.query(query);
        return parseInt(result.rows[0].count);
    }
    static async getOnlineUsers() {
        const query = 'SELECT COUNT(*) FROM users WHERE is_online = true';
        const result = await database_1.default.query(query);
        return parseInt(result.rows[0].count);
    }
    // NEW METHODS FOR ROOM FUNCTIONALITY
    static async updateCurrentRoom(userId, roomId) {
        const query = 'UPDATE users SET current_room = $1, is_online = true, last_seen = CURRENT_TIMESTAMP WHERE id = $2';
        await database_1.default.query(query, [roomId, userId]);
    }
    static async findByRoomId(roomId) {
        const query = 'SELECT * FROM users WHERE current_room = $1 ORDER BY is_online DESC, last_seen DESC';
        const result = await database_1.default.query(query, [roomId]);
        return result.rows.map(this.mapRowToUser);
    }
    static async getRoomUserCount(roomId) {
        const query = 'SELECT COUNT(*) FROM users WHERE current_room = $1';
        const result = await database_1.default.query(query, [roomId]);
        return parseInt(result.rows[0].count);
    }
    static async getRoomOnlineCount(roomId) {
        const query = 'SELECT COUNT(*) FROM users WHERE current_room = $1 AND is_online = true';
        const result = await database_1.default.query(query, [roomId]);
        return parseInt(result.rows[0].count);
    }
    static async updateUserLocation(userId, province, city) {
        const query = 'UPDATE users SET province = $1, city = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3';
        await database_1.default.query(query, [province, city, userId]);
    }
    static async searchUsers(query) {
        const searchQuery = `
      SELECT * FROM users 
      WHERE username ILIKE $1 OR full_name ILIKE $1 OR email ILIKE $1
      ORDER BY is_online DESC, last_seen DESC
      LIMIT 50
    `;
        const result = await database_1.default.query(searchQuery, [`%${query}%`]);
        return result.rows.map(this.mapRowToUser);
    }
    static async updateProfile(userId, updates) {
        const fields = [];
        const values = [];
        let paramCount = 1;
        if (updates.username !== undefined) {
            fields.push(`username = $${paramCount}`);
            values.push(updates.username);
            paramCount++;
        }
        if (updates.fullName !== undefined) {
            fields.push(`full_name = $${paramCount}`);
            values.push(updates.fullName);
            paramCount++;
        }
        if (updates.province !== undefined) {
            fields.push(`province = $${paramCount}`);
            values.push(updates.province);
            paramCount++;
        }
        if (updates.city !== undefined) {
            fields.push(`city = $${paramCount}`);
            values.push(updates.city);
            paramCount++;
        }
        if (fields.length === 0) {
            throw new Error('No fields to update');
        }
        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(userId);
        const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
        const result = await database_1.default.query(query, values);
        return this.mapRowToUser(result.rows[0]);
    }
    static mapRowToUser(row) {
        return {
            id: row.id,
            email: row.email,
            username: row.username,
            fullName: row.full_name,
            passwordHash: row.password_hash,
            isOnline: row.is_online,
            lastSeen: row.last_seen,
            province: row.province,
            city: row.city,
            currentRoom: row.current_room,
            termsAccepted: row.terms_accepted,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=User.js.map