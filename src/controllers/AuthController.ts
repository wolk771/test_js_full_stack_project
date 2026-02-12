import { Request, Response } from 'express';
import { Knex } from 'knex';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../interfaces/ApiResponse';

export class AuthController {
    public static async login(db: Knex, req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            // 1. User suchen
            const user = await db('app_users').where({ email }).first();
            if (!user) {
                res.status(401).json({ status: 'error', message: 'Ungültige Zugangsdaten' });
                return;
            }

            // 2. Passwort prüfen
            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                res.status(401).json({ status: 'error', message: 'Ungültige Zugangsdaten' });
                return;
            }

            // 3. JWT Token erstellen (Gültig für 8 Stunden)
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.GEHEIMNIS || 'fallback_secret',
                { expiresIn: '8h' }
            );

            const response: ApiResponse = {
                status: 'success',
                message: 'Login erfolgreich',
                data: { token, nickname: user.nickname }
            };
            res.json(response);

        } catch (error: any) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
}
