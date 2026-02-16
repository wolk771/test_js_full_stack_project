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
    const moderatorRole = await knex("app_roles").where({ role_name: 'MODERATOR' }).first();
    if (!moderatorRole) {
        throw new Error("❌ Kritischer Fehler: Rolle 'MODERATOR' existiert nicht. Migration 20260215120333 prüfen!");
    }
    const existingUser = await knex("app_users").where({ email: env_1.ENV.INIT_MOD_EMAIL }).first();
    if (!existingUser) {
        const modPass = await bcrypt_1.default.hash(env_1.ENV.INIT_MOD_PASS, env_1.ENV.BCRYPT_ROUNDS);
        const [insertedId] = await knex("app_users").insert({
            nickname: env_1.ENV.INIT_MOD_NICK,
            email: env_1.ENV.INIT_MOD_EMAIL,
            password_hash: modPass,
            is_active: true
        });
        const modId = Number(insertedId);
        await knex("app_user_roles").insert({
            user_id: modId,
            role_id: Number(moderatorRole.id)
        });
        console.log(`✅ Test-Moderator '${env_1.ENV.INIT_MOD_NICK}' erfolgreich angelegt.`);
    }
}
async function down(knex) {
    const user = await knex("app_users").where({ email: env_1.ENV.INIT_MOD_EMAIL }).first();
    if (user) {
        const userId = Number(user.id);
        await knex("app_user_roles").where({ user_id: userId }).del();
        await knex("app_users").where({ id: userId }).del();
        console.log(`🗑️ Test-Moderator ${env_1.ENV.INIT_MOD_EMAIL} wurde entfernt.`);
    }
}
