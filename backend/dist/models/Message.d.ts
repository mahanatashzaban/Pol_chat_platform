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
export declare class MessageModel {
    static findByRoomId(roomId: number, limit?: number): Promise<Message[]>;
    static create(messageData: {
        roomId: number;
        senderId: number;
        content: string;
        messageType?: 'text' | 'image' | 'file' | 'sticker' | 'camera';
    }): Promise<Message>;
    static updateContent(messageId: number, newContent: string): Promise<Message>;
    static delete(messageId: number): Promise<void>;
    static markAsRead(messageId: number): Promise<void>;
    static getUnreadCount(userId: number, roomId: number): Promise<number>;
    static findById(messageId: number): Promise<Message | null>;
    private static mapRowToMessage;
}
//# sourceMappingURL=Message.d.ts.map