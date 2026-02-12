"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthService {
    static async ensureAdminIntegrity(db) {
        const admin = await db('app_user_roles').where('role_id', 1).first();
        if (!admin) {
            console.log("⚠️ Integritäts-Fehler: Kein Administrator gefunden. Erstelle Notfall-Admin...");
            const hashedPass = await bcrypt_1.default.hash(process.env.INIT_ADMIN_PASS || 'admin123', 10);
            const [newAdminId] = await db('app_users').insert({
                nickname: process.env.INIT_ADMIN_NICK || 'RecoveryAdmin',
                email: process.env.INIT_ADMIN_EMAIL || 'admin@example.com',
                password_hash: hashedPass,
                is_active: true
            });
            await db('app_user_roles').insert({ user_id: newAdminId, role_id: 1 });
            console.log("✅ System-Integrität wiederhergestellt.");
        }
    }
}
exports.AuthService = AuthService;
