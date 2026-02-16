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
            if (!user) {
                const response = { status: 'error', message: 'Ungültige Zugangsdaten' };
                res.status(401).json(response);
                return;
            }
            const isMatch = await bcrypt_1.default.compare(password, user.password_hash);
            if (!isMatch) {
                const response = { status: 'error', message: 'Ungültige Zugangsdaten' };
                res.status(401).json(response);
                return;
            }
            if (!user.is_active) {
                const response = {
                    status: 'error',
                    message: 'Ihr Account ist deaktiviert. Bitte kontaktieren Sie den Support.'
                };
                res.status(403).json(response);
                return;
            }
            const token = jsonwebtoken_1.default.sign({
                userId: user.id,
                email: user.email,
                nickname: user.nickname || 'User',
                role: user.role_name,
                level: Number(user.permission_level)
            }, env_1.ENV.GEHEIMNIS, { expiresIn: '8h' });
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
    }
}
exports.AuthController = AuthController;
