import { Request } from 'express';

/**
 * Erweitert den Standard Express-Request um die User-Daten aus dem JWT.
 * Das 'user' Objekt entspricht dem Payload, den wir im AuthController signieren.
 */
export interface AuthRequest extends Request {
    user?: {
        userId: number;
        email: string;
        nickname: string;
        role: string;
        level: number;
    };
}
