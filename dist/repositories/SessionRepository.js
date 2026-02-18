"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionRepository = void 0;
class SessionRepository {
    static async create(db, data) {
        await db(this.TABLE_NAME).insert({
            user_id: data.user_id,
            token_hash: data.token_hash,
            role: data.permission_level,
            expires_at: data.expires_at
        });
    }
    static async deleteByHash(db, tokenHash) {
        return db(this.TABLE_NAME)
            .where({ token_hash: tokenHash })
            .del();
    }
    static async clearExpired(db) {
        return db(this.TABLE_NAME)
            .where('expires_at', '<', new Date())
            .del();
    }
}
exports.SessionRepository = SessionRepository;
SessionRepository.TABLE_NAME = 'app_sys_sessions';
