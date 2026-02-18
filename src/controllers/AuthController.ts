import { Request, Response } from 'express';
import { Knex } from 'knex';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../interfaces/ApiResponse';
import { ENV } from '../config/env';
import { UserRepository } from '../repositories/UserRepository';
import { SessionRepository } from '../repositories/SessionRepository';
import { CryptoUtils } from '../utils/cryptoUtils';
import { SessionData } from '../interfaces/SessionData';

export class AuthController {
    public static async login(db: Knex, req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            // 1. Validierung der Eingabe
            if (!email || !password) {
                const response: ApiResponse = { status: 'error', message: 'E-Mail und Passwort erforderlich' };
                res.status(400).json(response);
                return;
            }

            // 2. User suchen (inkl. Rolle für das Level)
            const user = await UserRepository.findByEmailWithRole(db, email);

            // 3. Authentifizierung & Status-Check
            if (!user || !user.is_active) {
                const message = !user ? 'Ungültige Zugangsdaten' : 'Account deaktiviert';
                const status = !user ? 401 : 403;
                res.status(status).json({ status: 'error', message } as ApiResponse);
                return;
            }

            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                res.status(401).json({ status: 'error', message: 'Ungültige Zugangsdaten' } as ApiResponse);
                return;
            }

            // 4. JWT erstellen
            // die Optionen explizit definieren (TS)
            const signOptions: jwt.SignOptions = {
                expiresIn: ENV.AUTH_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn']
            };

            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email,
                    nickname: user.nickname,
                    role: user.role_name,
                    level: Number(user.permission_level)
                },
                ENV.GEHEIMNIS as jwt.Secret, // Type Assertion auf jwt.Secret
                signOptions
            );

            // 5. SESSION-SYNC (Der neue Part)
            // Als Transaktion, um sicherzustellen, dass die Session 
            // garantiert gespeichert wird, wenn der Login als Erfolg gilt.
            await db.transaction(async (trx) => {
                const tokenHash = CryptoUtils.hashToken(token);
                const expiresAt = new Date(Date.now() + ENV.AUTH_SESSION_TTL_MS);

                const sessionData: SessionData = {
                    user_id: user.id,
                    token_hash: tokenHash,
                    permission_level: Number(user.permission_level),
                    expires_at: expiresAt
                };

                await SessionRepository.create(trx, sessionData);
            });

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

        // Abgelaufene Token Hash löschen.
        SessionRepository.clearExpired(db);
    }

    /**
     * Löscht Token-Hash aus dem Datenbank,
     * soll nur mit 'protect' beim API Aufruf verwendet werden. 
     */
    public static async logout(db: Knex, req: Request, res: Response): Promise<void> {
        try {
            // Da 'protect' bereits gelaufen ist,
            // soll der Header da sein
            const authHeader = req.headers.authorization!;
            const token = authHeader.split(' ')[1];
            const tokenHash = CryptoUtils.hashToken(token);

            // Wir löschen den Hash aus der DB
            const deletedCount = await SessionRepository.deleteByHash(db, tokenHash);

            if (deletedCount > 0) {
                console.log(`✅ Session für Hash ...${tokenHash.substring(0, 8)} erfolgreich beendet.`);
            } else {
                console.log(`ℹ️ Logout: Session war bereits in DB gelöscht oder abgelaufen.`);
            }

            // Antwort ist IMMER Erfolg
            const response: ApiResponse = {
                status: 'success',
                message: 'Erfolgreich abgemeldet'
            };
            res.json(response);

        } catch (error: any) {
            console.error("❌ Kritischer Fehler beim Logout:", error.message);
            res.status(500).json({
                status: 'error',
                message: 'Ein interner Fehler ist aufgetreten'
            } as ApiResponse);
        }
    }


}
