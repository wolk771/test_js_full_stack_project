import { Request, Response } from 'express';
import { Knex } from 'knex';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../interfaces/ApiResponse';
import { ENV } from '../config/env';
import { UserRepository } from '../repositories/UserRepository';

export class AuthController {
    public static async login(db: Knex, req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            // 1. Validierung
            if (!email || !password) {
                const response: ApiResponse = { status: 'error', message: 'E-Mail und Passwort erforderlich' };
                res.status(400).json(response);
                return;
            }

            // 2. User suchen
            const user = await UserRepository.findByEmailWithRole(db, email);

            // 3. Authentifizierung
            if (!user) {
                const response: ApiResponse = { status: 'error', message: 'Ungültige Zugangsdaten' };
                res.status(401).json(response);
                return;
            }

            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                const response: ApiResponse = { status: 'error', message: 'Ungültige Zugangsdaten' };
                res.status(401).json(response);
                return;
            }

            // 4. Status-Check
            if (!user.is_active) {
                const response: ApiResponse = { 
                    status: 'error', 
                    message: 'Ihr Account ist deaktiviert. Bitte kontaktieren Sie den Support.' 
                };
                res.status(403).json(response);
                return;
            }

            // 5. JWT erstellen
            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email,
                    nickname: user.nickname || 'User',
                    role: user.role_name,
                    level: Number(user.permission_level)
                },
                ENV.GEHEIMNIS,
                { expiresIn: '8h' }
            );

            // 6. Erfolgreiche Antwort
            const response: ApiResponse = {
                status: 'success',
                message: 'Login erfolgreich',
                data: {
                    token,
                    nickname: user.nickname,
                    role: user.role_name
                }
            };
            res.json(response);

        } catch (error: any) {
            console.error("❌ Login Fehler:", error.message);
            const response: ApiResponse = {
                status: 'error',
                message: 'Ein interner Fehler ist aufgetreten',
                errorDetails: ENV.NODE_ENV === 'development' ? error.message : undefined
            };
            res.status(500).json(response);
        }
    }
}
