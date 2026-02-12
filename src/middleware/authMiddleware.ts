import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const protect = (req: Request, res: Response, next: NextFunction) => {
    let token;

    // Token aus dem Header "Authorization: Bearer <token>" extrahieren
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Nicht autorisiert, kein Token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.GEHEIMNIS || 'fallback_secret');
        // @ts-ignore - User-Daten an den Request anhängen
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ status: 'error', message: 'Token ungültig' });
    }
};
