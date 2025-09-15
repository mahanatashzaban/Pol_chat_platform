import { Request, Response } from 'express';
export declare class ChatController {
    static getRooms(req: Request, res: Response): Promise<void>;
    static getRoom(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static createRoom(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getMessages(req: Request, res: Response): Promise<void>;
    static sendMessage(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static editMessage(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteMessage(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static joinRoom(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static leaveRoom(req: Request, res: Response): Promise<void>;
    static getRoomUsers(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=chatController.d.ts.map