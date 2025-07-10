import { Response } from 'express';
export declare class AuthController {
    register(body: {
        email: string;
        password: string;
        name: string;
    }): Promise<any>;
    login(body: {
        email: string;
        password: string;
    }): Promise<any>;
    test(): Promise<{
        message: string;
        timestamp: Date;
        dbUrl: string;
    }>;
    googleCallback(code: string, error: string, res: Response): Promise<void>;
}
