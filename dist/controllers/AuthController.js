"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthController {
    static async login(db, req, res) {
        try {
            const { email, password } = req.body;
            const user = await db('app_users').where({ email }).first();
            if (!user) {
                res.status(401).json({ status: 'error', message: 'Ungültige Zugangsdaten' });
                return;
            }
            const isMatch = await bcrypt_1.default.compare(password, user.password_hash);
            if (!isMatch) {
                res.status(401).json({ status: 'error', message: 'Ungültige Zugangsdaten' });
                return;
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.GEHEIMNIS || 'fallback_secret', { expiresIn: '8h' });
            const response = {
                status: 'success',
                message: 'Login erfolgreich',
                data: { token, nickname: user.nickname }
            };
            res.json(response);
        }
        catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
}
exports.AuthController = AuthController;
