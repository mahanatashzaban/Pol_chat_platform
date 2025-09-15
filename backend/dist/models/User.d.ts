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
    currentRoom?: number;
    termsAccepted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class UserModel {
    static create(userData: {
        email: string;
        username: string;
        fullName: string;
        passwordHash: string;
        termsAccepted: boolean;
    }): Promise<User>;
    static findByEmail(email: string): Promise<User | null>;
    static findById(id: number): Promise<User | null>;
    static updateLastSeen(userId: number): Promise<void>;
    static setOnlineStatus(userId: number, isOnline: boolean): Promise<void>;
    static getTotalUsers(): Promise<number>;
    static getOnlineUsers(): Promise<number>;
    static updateCurrentRoom(userId: number, roomId: number | null): Promise<void>;
    static findByRoomId(roomId: number): Promise<User[]>;
    static getRoomUserCount(roomId: number): Promise<number>;
    static getRoomOnlineCount(roomId: number): Promise<number>;
    static updateUserLocation(userId: number, province: string, city: string): Promise<void>;
    static searchUsers(query: string): Promise<User[]>;
    static updateProfile(userId: number, updates: {
        username?: string;
        fullName?: string;
        province?: string;
        city?: string;
    }): Promise<User>;
    private static mapRowToUser;
}
//# sourceMappingURL=User.d.ts.map