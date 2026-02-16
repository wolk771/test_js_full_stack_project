import { Knex } from 'knex';
import bcrypt from 'bcrypt';
import { ENV } from '../config/env';
import { UserRepository } from '../repositories/UserRepository';

export class AuthService {
    /**
     * Stellt sicher, dass das System niemals ohne Administrator ist.
     * Behandelt auch den Fall, dass der User existiert, aber die Rolle fehlt.
     */
    public static async ensureAdminIntegrity(db: Knex): Promise<void> {
        try {
            const adminRoleId = await UserRepository.findRoleIdByName(db, 'ADMIN');
            if (!adminRoleId) {
                console.warn("⚠️ Rolle 'ADMIN' fehlt. Migrationen prüfen!");
                return;
            }

            const hasAnyAdmin = await UserRepository.hasRoleAssignment(db, adminRoleId);

            if (!hasAnyAdmin) {
                console.log("⚠️ Kein Administrator gefunden. Starte Wiederherstellung...");

                await db.transaction(async (trx) => {
                    const existingUser = await UserRepository.findByEmail(trx, ENV.INIT_ADMIN_EMAIL);

                    if (!existingUser) {
                        const hashedPass = await bcrypt.hash(ENV.INIT_ADMIN_PASS, ENV.BCRYPT_ROUNDS);
                        await UserRepository.createWithRole(trx, {
                            nickname: ENV.INIT_ADMIN_NICK,
                            email: ENV.INIT_ADMIN_EMAIL,
                            password_hash: hashedPass,
                            is_active: true
                        }, adminRoleId);
                    } else {
                        const userId = Number(existingUser.id);
                        const alreadyHasRole = await UserRepository.hasSpecificRole(trx, userId, adminRoleId);

                        if (!alreadyHasRole) {
                            await UserRepository.assignRole(trx, userId, adminRoleId);
                        }
                    }
                });
                console.log(`✅ Admin-Integrität gewährt: ${ENV.INIT_ADMIN_EMAIL}`);
            }
        } catch (error: any) {
            console.error("❌ Kritischer Fehler im AuthService:", error.message);
            throw error;
        }
    }
}
