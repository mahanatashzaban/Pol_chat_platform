export declare class PasswordUtils {
    static hashPassword(password: string): Promise<string>;
    static comparePassword(password: string, hashedPassword: string): Promise<boolean>;
    static isPasswordStrong(password: string): boolean;
}
//# sourceMappingURL=passwordUtils.d.ts.map