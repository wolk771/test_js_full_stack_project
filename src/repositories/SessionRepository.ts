import { Knex } from 'knex';
import { SessionData } from '../interfaces/SessionData';

export class SessionRepository {
    private static readonly TABLE_NAME = 'app_sys_sessions';

    /**
     * Speichert eine neue Session.
     * @param db - Knex Instanz oder Transaktion
     */
    public static async create(db: Knex | Knex.Transaction, data: SessionData): Promise<void> {
        await db(this.TABLE_NAME).insert({
            user_id: data.user_id,
            token_hash: data.token_hash,
            role: data.permission_level, // Mapping auf das Tabellenfeld 'role'
            expires_at: data.expires_at
        });
    }

    /**
     * Löscht eine Session anhand des Hashes (Logout).
     */
    public static async deleteByHash(db: Knex | Knex.Transaction, tokenHash: string): Promise<number> {
        return db(this.TABLE_NAME)
            .where({ token_hash: tokenHash })
            .del();
    }

    /**
     * Bereinigt abgelaufene Sessions.
     */
    public static async clearExpired(db: Knex): Promise<number> {
        return db(this.TABLE_NAME)
            .where('expires_at', '<', new Date())
            .del();
    }
}
