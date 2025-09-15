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
export declare class ChatRoomModel {
    static findAll(): Promise<ChatRoom[]>;
    static findByLocation(province: string, city: string): Promise<ChatRoom[]>;
    static findById(id: number): Promise<ChatRoom | null>;
    static create(roomData: {
        name: string;
        description?: string;
        province: string;
        city: string;
        maxUsers?: number;
        isPublic?: boolean;
        createdBy?: number;
    }): Promise<ChatRoom>;
    static updateUserCount(roomId: number): Promise<void>;
    static delete(id: number): Promise<void>;
    private static mapRowToChatRoom;
}
//# sourceMappingURL=ChatRoom.d.ts.map