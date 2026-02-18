"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const UserRepository_1 = require("../repositories/UserRepository");
const SessionRepository_1 = require("../repositories/SessionRepository");
const cryptoUtils_1 = require("../utils/cryptoUtils");
class AuthController {
    static async login(db, req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                const response = { status: 'error', message: 'E-Mail und Passwort erforderlich' };
                res.status(400).json(response);
                return;
            }
            const user = await UserRepository_1.UserRepository.findByEmailWithRole(db, email);
            if (!user || !user.is_active) {
                const message = !user ? 'Ungültige Zugangsdaten' : 'Account deaktiviert';
                const status = !user ? 401 : 403;
                res.status(status).json({ status: 'error', message });
                return;
            }
            const isMatch = await bcrypt_1.default.compare(password, user.password_hash);
            if (!isMatch) {
                res.status(401).json({ status: 'error', message: 'Ungültige Zugangsdaten' });
                return;
            }
            const signOptions = {
                expiresIn: env_1.ENV.AUTH_TOKEN_EXPIRES_IN
            };
            const token = jsonwebtoken_1.default.sign({
                userId: user.id,
                email: user.email,
                nickname: user.nickname,
                role: user.role_name,
                level: Number(user.permission_level)
            }, env_1.ENV.GEHEIMNIS, signOptions);
            await db.transaction(async (trx) => {
                const tokenHash = cryptoUtils_1.CryptoUtils.hashToken(token);
                const expiresAt = new Date(Date.now() + env_1.ENV.AUTH_SESSION_TTL_MS);
                const sessionData = {
                    user_id: user.id,
                    token_hash: tokenHash,
                    permission_level: Number(user.permission_level),
                    expires_at: expiresAt
                };
                await SessionRepository_1.SessionRepository.create(trx, sessionData);
            });
            const response = {
                status: 'success',
                message: 'Login erfolgreich',
                data: {
                    token,
                    nickname: user.nickname,
                    role: user.role_name
                }
            };
            res.json(response);
        }
        catch (error) {
            console.error("❌ Login Fehler:", error.message);
            const response = {
                status: 'error',
                message: 'Ein interner Fehler ist aufgetreten',
                errorDetails: env_1.ENV.NODE_ENV === 'development' ? error.message : undefined
            };
            res.status(500).json(response);
        }
        SessionRepository_1.SessionRepository.clearExpired(db);
    }
    static async logout(db, req, res) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader.split(' ')[1];
            const tokenHash = cryptoUtils_1.CryptoUtils.hashToken(token);
            const deletedCount = await SessionRepository_1.SessionRepository.deleteByHash(db, tokenHash);
            if (deletedCount > 0) {
                console.log(`✅ Session für Hash ...${tokenHash.substring(0, 8)} erfolgreich beendet.`);
            }
            else {
                console.log(`ℹ️ Logout: Session war bereits in DB gelöscht oder abgelaufen.`);
            }
            const response = {
                status: 'success',
                message: 'Erfolgreich abgemeldet'
            };
            res.json(response);
        }
        catch (error) {
            console.error("❌ Kritischer Fehler beim Logout:", error.message);
            res.status(500).json({
                status: 'error',
                message: 'Ein interner Fehler ist aufgetreten'
            });
        }
    }
}
exports.AuthController = AuthController;
