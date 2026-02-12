"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function up(knex) {
    await knex("app_roles").insert([
        { id: 1, role_name: 'ADMIN', permission_level: 100 },
        { id: 2, role_name: 'USER', permission_level: 10 }
    ]);
    const adminPass = await bcrypt_1.default.hash(process.env.INIT_ADMIN_PASS || 'admin123', 10);
    const userPass = await bcrypt_1.default.hash(process.env.INIT_USER_PASS || 'user123', 10);
    const [adminId] = await knex("app_users").insert({
        nickname: process.env.INIT_ADMIN_NICK || 'InitialAdmin',
        email: process.env.INIT_ADMIN_EMAIL || 'admin@example.com',
        password_hash: adminPass,
        is_active: true
    });
    const [userId] = await knex("app_users").insert({
        nickname: process.env.INIT_USER_NICK || 'TestUser',
        email: process.env.INIT_USER_EMAIL || 'user@example.com',
        password_hash: userPass,
        is_active: true
    });
    await knex("app_user_roles").insert([
        { user_id: adminId, role_id: 1 },
        { user_id: userId, role_id: 2 }
    ]);
    console.log("✅ Nominale User & Rollen wurden via Migration angelegt.");
}
async function down(knex) {
    await knex("app_user_roles").truncate();
    await knex("app_users").truncate();
    await knex("app_roles").truncate();
}
