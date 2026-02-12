import { Knex } from 'knex';
import bcrypt from 'bcrypt';

export class AuthService {
    /**
     * Stellt sicher, dass das System niemals ohne Administrator ist.
     */
    public static async ensureAdminIntegrity(db: Knex): Promise<void> {
        // Prüfe ob mindestens ein User mit ADMIN-Rolle (ID 1) existiert
        const admin = await db('app_user_roles').where('role_id', 1).first();

        if (!admin) {
            console.log("⚠️ Integritäts-Fehler: Kein Administrator gefunden. Erstelle Notfall-Admin...");
            
            const hashedPass = await bcrypt.hash(process.env.INIT_ADMIN_PASS || 'admin123', 10);
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
