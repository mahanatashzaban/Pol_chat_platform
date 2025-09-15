export interface JwtPayload {
    userId: number;
    email: string;
    username: string;
}
export declare class JwtUtils {
    static generateToken(payload: JwtPayload): string;
    static verifyToken(token: string): JwtPayload;
    static decodeToken(token: string): JwtPayload;
}
//# sourceMappingURL=jwtUtils.d.ts.map