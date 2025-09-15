import pool from '../config/database';

export interface User {
  id: number;
  email: string;
  username: string;
  fullName: string;
  passwordHash: string;
  isOnline: boolean;
  lastSeen: Date;
  province?: string;
  city?: string;
  currentRoom?: number;  // Changed from string to number to match database
  termsAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class UserModel {
  static async create(userData: {
    email: string;
    username: string;
    fullName: string;
    passwordHash: string;
    termsAccepted: boolean;
  }): Promise<User> {
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

    const result = await pool.query(query, values);
    return this.mapRowToUser(result.rows[0]);
  }

  static async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapRowToUser(result.rows[0]);
  }

  static async findById(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapRowToUser(result.rows[0]);
  }

  static async updateLastSeen(userId: number): Promise<void> {
    const query = 'UPDATE users SET last_seen = CURRENT_TIMESTAMP WHERE id = $1';
    await pool.query(query, [userId]);
  }

  static async setOnlineStatus(userId: number, isOnline: boolean): Promise<void> {
    const query = 'UPDATE users SET is_online = $1, last_seen = CURRENT_TIMESTAMP WHERE id = $2';
    await pool.query(query, [isOnline, userId]);
  }

  static async getTotalUsers(): Promise<number> {
    const query = 'SELECT COUNT(*) FROM users';
    const result = await pool.query(query);
    return parseInt(result.rows[0].count);
  }

  static async getOnlineUsers(): Promise<number> {
    const query = 'SELECT COUNT(*) FROM users WHERE is_online = true';
    const result = await pool.query(query);
    return parseInt(result.rows[0].count);
  }

  // NEW METHODS FOR ROOM FUNCTIONALITY

  static async updateCurrentRoom(userId: number, roomId: number | null): Promise<void> {
    const query = 'UPDATE users SET current_room = $1, is_online = true, last_seen = CURRENT_TIMESTAMP WHERE id = $2';
    await pool.query(query, [roomId, userId]);
  }

  static async findByRoomId(roomId: number): Promise<User[]> {
    const query = 'SELECT * FROM users WHERE current_room = $1 ORDER BY is_online DESC, last_seen DESC';
    const result = await pool.query(query, [roomId]);
    
    return result.rows.map(this.mapRowToUser);
  }

  static async getRoomUserCount(roomId: number): Promise<number> {
    const query = 'SELECT COUNT(*) FROM users WHERE current_room = $1';
    const result = await pool.query(query, [roomId]);
    return parseInt(result.rows[0].count);
  }

  static async getRoomOnlineCount(roomId: number): Promise<number> {
    const query = 'SELECT COUNT(*) FROM users WHERE current_room = $1 AND is_online = true';
    const result = await pool.query(query, [roomId]);
    return parseInt(result.rows[0].count);
  }

  static async updateUserLocation(userId: number, province: string, city: string): Promise<void> {
    const query = 'UPDATE users SET province = $1, city = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3';
    await pool.query(query, [province, city, userId]);
  }

  static async searchUsers(query: string): Promise<User[]> {
    const searchQuery = `
      SELECT * FROM users 
      WHERE username ILIKE $1 OR full_name ILIKE $1 OR email ILIKE $1
      ORDER BY is_online DESC, last_seen DESC
      LIMIT 50
    `;
    const result = await pool.query(searchQuery, [`%${query}%`]);
    return result.rows.map(this.mapRowToUser);
  }

  static async updateProfile(userId: number, updates: {
    username?: string;
    fullName?: string;
    province?: string;
    city?: string;
  }): Promise<User> {
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
    const result = await pool.query(query, values);
    
    return this.mapRowToUser(result.rows[0]);
  }

  private static mapRowToUser(row: any): User {
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