"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const bcrypt_1 = __importDefault(require("bcrypt"));
const env_1 = require("../config/env");
async function up(knex) {
    await knex("app_roles").insert([
        { role_name: 'ADMIN', permission_level: 100 },
        { role_name: 'USER', permission_level: 10 }
    ]);
    const adminRole = await knex("app_roles").where({ role_name: 'ADMIN' }).first();
    const userRole = await knex("app_roles").where({ role_name: 'USER' }).first();
    if (!adminRole || !userRole) {
        throw new Error("❌ Kritischer Fehler: Rollen konnten nicht korrekt angelegt werden.");
    }
    const adminPass = await bcrypt_1.default.hash(env_1.ENV.INIT_ADMIN_PASS, env_1.ENV.BCRYPT_ROUNDS);
    const userPass = await bcrypt_1.default.hash(env_1.ENV.INIT_USER_PASS, env_1.ENV.BCRYPT_ROUNDS);
    const [insertedAdminId] = await knex("app_users").insert({
        nickname: env_1.ENV.INIT_ADMIN_NICK,
        email: env_1.ENV.INIT_ADMIN_EMAIL,
        password_hash: adminPass,
        is_active: true
    });
    const adminId = Number(insertedAdminId);
    const [insertedUserId] = await knex("app_users").insert({
        nickname: env_1.ENV.INIT_USER_NICK,
        email: env_1.ENV.INIT_USER_EMAIL,
        password_hash: userPass,
        is_active: true
    });
    const userId = Number(insertedUserId);
    await knex("app_user_roles").insert([
        { user_id: adminId, role_id: adminRole.id },
        { user_id: userId, role_id: userRole.id }
    ]);
    console.log("✅ Nominale User & Rollen wurden angelegt.");
}
async function down(knex) {
    await knex("app_user_roles").truncate();
    await knex("app_users").truncate();
    await knex("app_roles").truncate();
}
