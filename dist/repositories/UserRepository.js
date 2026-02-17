"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
class UserRepository {
    static async findByEmail(db, email) {
        return db('app_users').where({ email }).first();
    }
    static async findByEmailWithRole(db, email) {
        const user = await db('app_users as u')
            .select('u.id', 'u.nickname', 'u.email', 'u.password_hash', 'u.is_active', 'r.role_name', 'r.permission_level')
            .leftJoin('app_user_roles as ur', 'u.id', 'ur.user_id')
            .leftJoin('app_roles as r', 'ur.role_id', 'r.id')
            .where('u.email', email)
            .orderBy('r.permission_level', 'desc')
            .first();
        if (!user || !user.role_name)
            return null;
        return user;
    }
    static async hasRoleAssignment(db, roleId) {
        const assignment = await db('app_user_roles').where({ role_id: roleId }).first();
        return !!assignment;
    }
    static async createWithRole(db, userData, roleId) {
        const [insertedId] = await db('app_users').insert(userData);
        const userId = Number(insertedId);
        await db('app_user_roles').insert({
            user_id: userId,
            role_id: roleId
        });
        return userId;
    }
    static async findRoleIdByName(db, roleName) {
        const role = await db('app_roles').where({ role_name: roleName }).first();
        return role ? Number(role.id) : null;
    }
    static async hasSpecificRole(db, userId, roleId) {
        const exists = await db('app_user_roles')
            .where({ user_id: userId, role_id: roleId })
            .first();
        return !!exists;
    }
    static async assignRole(db, userId, roleId) {
        await db('app_user_roles').insert({ user_id: userId, role_id: roleId });
    }
    static async getAllUsers(db) {
        return db('app_users as u')
            .select('u.id', 'u.nickname', 'u.email', 'u.is_active', 'u.created_at', 'r.role_name', 'r.permission_level')
            .leftJoin('app_user_roles as ur', 'u.id', 'ur.user_id')
            .leftJoin('app_roles as r', 'ur.role_id', 'r.id')
            .orderBy('u.id', 'asc');
    }
}
exports.UserRepository = UserRepository;
