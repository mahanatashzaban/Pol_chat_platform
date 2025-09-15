import { Request, Response } from 'express';
export declare class AuthController {
    static login(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static signup(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getStats(req: Request, res: Response): Promise<void>;
    static verifyToken(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=authController.d.ts.map