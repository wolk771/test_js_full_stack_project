import { Knex } from "knex";
import bcrypt from "bcrypt";
import { ENV } from "../config/env";

export async function up(knex: Knex): Promise<void> {
    // 1. Dynamisch die ID der MODERATOR-Rolle holen
    const moderatorRole = await knex("app_roles").where({ role_name: 'MODERATOR' }).first();

    if (!moderatorRole) {
        throw new Error("❌ Kritischer Fehler: Rolle 'MODERATOR' existiert nicht. Migration 20260215120333 prüfen!");
    }

    // 2. Prüfen, ob der Test-Moderator bereits existiert (ENV-validiert)
    const existingUser = await knex("app_users").where({ email: ENV.INIT_MOD_EMAIL }).first();

    if (!existingUser) {
        const modPass = await bcrypt.hash(ENV.INIT_MOD_PASS, ENV.BCRYPT_ROUNDS);

        // User anlegen
        const [insertedId] = await knex("app_users").insert({
            nickname: ENV.INIT_MOD_NICK,
            email: ENV.INIT_MOD_EMAIL,
            password_hash: modPass,
            is_active: true
        });
        
        const modId = Number(insertedId);

        // Rolle dynamisch zuweisen
        await knex("app_user_roles").insert({
            user_id: modId,
            role_id: Number(moderatorRole.id)
        });

        console.log(`✅ Test-Moderator '${ENV.INIT_MOD_NICK}' erfolgreich angelegt.`);
    }
}

export async function down(knex: Knex): Promise<void> {
    // Sicherer Revert basierend auf der ENV-E-Mail
    const user = await knex("app_users").where({ email: ENV.INIT_MOD_EMAIL }).first();

    if (user) {
        const userId = Number(user.id);
        // Zuerst Verknüpfung (Foreign Key), dann User
        await knex("app_user_roles").where({ user_id: userId }).del();
        await knex("app_users").where({ id: userId }).del();
        console.log(`🗑️ Test-Moderator ${ENV.INIT_MOD_EMAIL} wurde entfernt.`);
    }
}
