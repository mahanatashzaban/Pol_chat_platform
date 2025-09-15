import pool from '../config/database';

export interface ChatRoom {
  id: number;
  name: string;
  description?: string;
  province: string;
  city: string;
  maxUsers: number;
  isPublic: boolean;
  createdBy?: number;
  createdAt: Date;
  updatedAt: Date;
  userCount?: number;
  onlineCount?: number;
}

export class ChatRoomModel {
  static async findAll(): Promise<ChatRoom[]> {
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
    
    const result = await pool.query(query);
    return result.rows.map(this.mapRowToChatRoom);
  }

  static async findByLocation(province: string, city: string): Promise<ChatRoom[]> {
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
    
    const result = await pool.query(query, [province, city]);
    return result.rows.map(this.mapRowToChatRoom);
  }

  static async findById(id: number): Promise<ChatRoom | null> {
    const query = `
      SELECT cr.*, 
             COUNT(DISTINCT u.id) as user_count,
             COUNT(DISTINCT CASE WHEN u.is_online THEN u.id END) as online_count
      FROM chat_rooms cr
      LEFT JOIN users u ON u.current_room = cr.id
      WHERE cr.id = $1
      GROUP BY cr.id
    `;
    
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapRowToChatRoom(result.rows[0]);
  }

  static async create(roomData: {
    name: string;
    description?: string;
    province: string;
    city: string;
    maxUsers?: number;
    isPublic?: boolean;
    createdBy?: number;
  }): Promise<ChatRoom> {
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

    const result = await pool.query(query, values);
    return this.mapRowToChatRoom(result.rows[0]);
  }

  static async updateUserCount(roomId: number): Promise<void> {
    const query = `
      UPDATE chat_rooms 
      SET updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await pool.query(query, [roomId]);
  }

  static async delete(id: number): Promise<void> {
    const query = 'DELETE FROM chat_rooms WHERE id = $1';
    await pool.query(query, [id]);
  }

  private static mapRowToChatRoom(row: any): ChatRoom {
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
