"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const env_1 = require("../config/env");
const UserRepository_1 = require("../repositories/UserRepository");
class AuthService {
    static async ensureAdminIntegrity(db) {
        try {
            const adminRoleId = await UserRepository_1.UserRepository.findRoleIdByName(db, 'ADMIN');
            if (!adminRoleId) {
                console.warn("⚠️ Rolle 'ADMIN' fehlt. Migrationen prüfen!");
                return;
            }
            const hasAnyAdmin = await UserRepository_1.UserRepository.hasRoleAssignment(db, adminRoleId);
            if (!hasAnyAdmin) {
                console.log("⚠️ Kein Administrator gefunden. Starte Wiederherstellung...");
                await db.transaction(async (trx) => {
                    const existingUser = await UserRepository_1.UserRepository.findByEmail(trx, env_1.ENV.INIT_ADMIN_EMAIL);
                    if (!existingUser) {
                        const hashedPass = await bcrypt_1.default.hash(env_1.ENV.INIT_ADMIN_PASS, env_1.ENV.BCRYPT_ROUNDS);
                        await UserRepository_1.UserRepository.createWithRole(trx, {
                            nickname: env_1.ENV.INIT_ADMIN_NICK,
                            email: env_1.ENV.INIT_ADMIN_EMAIL,
                            password_hash: hashedPass,
                            is_active: true
                        }, adminRoleId);
                    }
                    else {
                        const userId = Number(existingUser.id);
                        const alreadyHasRole = await UserRepository_1.UserRepository.hasSpecificRole(trx, userId, adminRoleId);
                        if (!alreadyHasRole) {
                            await UserRepository_1.UserRepository.assignRole(trx, userId, adminRoleId);
                        }
                    }
                });
                console.log(`✅ Admin-Integrität gewährt: ${env_1.ENV.INIT_ADMIN_EMAIL}`);
            }
        }
        catch (error) {
            console.error("❌ Kritischer Fehler im AuthService:", error.message);
            throw error;
        }
    }
}
exports.AuthService = AuthService;
