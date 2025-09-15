import pool from '../config/database';

export interface Message {
  id: number;
  roomId: number;
  senderId: number;
  senderName: string;
  content: string;
  messageType: 'text' | 'image' | 'file' | 'sticker' | 'camera';
  isEdited: boolean;
  isRead: boolean;
  editedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class MessageModel {
  static async findByRoomId(roomId: number, limit: number = 100): Promise<Message[]> {
    const query = `
      SELECT m.*, u.username as sender_name
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.room_id = $1
      ORDER BY m.created_at DESC
      LIMIT $2
    `;
    
    const result = await pool.query(query, [roomId, limit]);
    return result.rows.map(this.mapRowToMessage);
  }

  static async create(messageData: {
    roomId: number;
    senderId: number;
    content: string;
    messageType?: 'text' | 'image' | 'file' | 'sticker' | 'camera';
  }): Promise<Message> {
    const query = `
      INSERT INTO messages (room_id, sender_id, content, message_type)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [
      messageData.roomId,
      messageData.senderId,
      messageData.content,
      messageData.messageType || 'text'
    ];

    const result = await pool.query(query, values);
    
    // Get sender name
    const senderQuery = 'SELECT username FROM users WHERE id = $1';
    const senderResult = await pool.query(senderQuery, [messageData.senderId]);
    
    const message = this.mapRowToMessage(result.rows[0]);
    message.senderName = senderResult.rows[0]?.username || 'Unknown';
    
    return message;
  }

  static async updateContent(messageId: number, newContent: string): Promise<Message> {
    const query = `
      UPDATE messages 
      SET content = $1, is_edited = true, edited_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    
    const result = await pool.query(query, [newContent, messageId]);
    return this.mapRowToMessage(result.rows[0]);
  }

  static async delete(messageId: number): Promise<void> {
    const query = 'DELETE FROM messages WHERE id = $1';
    await pool.query(query, [messageId]);
  }

  static async markAsRead(messageId: number): Promise<void> {
    const query = 'UPDATE messages SET is_read = true WHERE id = $1';
    await pool.query(query, [messageId]);
  }

  static async getUnreadCount(userId: number, roomId: number): Promise<number> {
    const query = `
      SELECT COUNT(*) 
      FROM messages m
      WHERE m.room_id = $1 AND m.sender_id != $2 AND m.is_read = false
    `;
    
    const result = await pool.query(query, [roomId, userId]);
    return parseInt(result.rows[0].count);
  }

  static async findById(messageId: number): Promise<Message | null> {
    const query = `
      SELECT m.*, u.username as sender_name
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.id = $1
    `;
    
    const result = await pool.query(query, [messageId]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapRowToMessage(result.rows[0]);
  }

  private static mapRowToMessage(row: any): Message {
    return {
      id: row.id,
      roomId: row.room_id,
      senderId: row.sender_id,
      senderName: row.sender_name,
      content: row.content,
      messageType: row.message_type,
      isEdited: row.is_edited,
      isRead: row.is_read,
      editedAt: row.edited_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}
