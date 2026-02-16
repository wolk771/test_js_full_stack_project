import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthRequest } from '../interfaces/AuthRequest';
import { ApiResponse } from '../interfaces/ApiResponse';
import { ENV } from '../config/env';

/**
 * Prüft, ob die Anfrage von einem angemeldeten User kommt.
 */
export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    
    // 1. Basis-Check des Authorization Headers
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const response: ApiResponse = {
            status: 'error',
            message: 'Nicht autorisiert: Kein gültiges Token vorhanden'
        };
        return res.status(401).json(response);
    }

    // 2. Token extrahieren
    const token = authHeader.split(' ')[1];

    try {
        // 3. Token verifizieren
        const decoded = jwt.verify(token, ENV.GEHEIMNIS) as JwtPayload;

        // 4. Vollständigkeits-Check aller benötigten Felder (Defensive Coding)
        if (
            !decoded || 
            !decoded.userId || 
            !decoded.email || 
            !decoded.nickname || 
            !decoded.role || 
            decoded.level === undefined
        ) {
            throw new Error('Token-Inhalt unvollständig');
        }

        // 5. Dem Request-Objekt zuweisen
        req.user = {
            userId: Number(decoded.userId),
            email: String(decoded.email),
            nickname: String(decoded.nickname),
            role: String(decoded.role),
            level: Number(decoded.level)
        };
        
        next();
    } catch (err) {
        const response: ApiResponse = {
            status: 'error',
            message: 'Ungültiges oder abgelaufenes Token'
        };
        return res.status(401).json(response);
    }
};

/**
 * Prüft, ob das Permission-Level des Users ausreicht.
 */
export const restrictToLevel = (minLevel: number) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || req.user.level < minLevel) {
            const response: ApiResponse = {
                status: 'error',
                message: 'Zugriff verweigert: Unzureichende Berechtigungen'
            };
            return res.status(403).json(response);
        }
        next();
    };
};
