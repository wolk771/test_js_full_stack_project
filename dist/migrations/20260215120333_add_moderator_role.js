"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    const exists = await knex("app_roles").where({ role_name: 'MODERATOR' }).first();
    if (!exists) {
        await knex("app_roles").insert({
            role_name: 'MODERATOR',
            permission_level: 50
        });
        console.log("✅ Rolle 'MODERATOR' (Level 50) wurde hinzugefügt.");
    }
}
async function down(knex) {
    await knex("app_roles").where({ role_name: 'MODERATOR' }).del();
}
