import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Vorprüfung für Idempotenz
    const exists = await knex("app_roles").where({ role_name: 'MODERATOR' }).first();
    
    if (!exists) {
        await knex("app_roles").insert({
            role_name: 'MODERATOR',
            permission_level: 50 // Festes Level für die Logik (Moderator-Stufe)
        });
        console.log("✅ Rolle 'MODERATOR' (Level 50) wurde hinzugefügt.");
    }
}

export async function down(knex: Knex): Promise<void> {
    await knex("app_roles").where({ role_name: 'MODERATOR' }).del();
}
