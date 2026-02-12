import { Knex } from "knex";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export async function up(knex: Knex): Promise<void> {
    // 1. Rollen einfügen (Erweiterbar für spezifische App-Zwecke)
    await knex("app_roles").insert([
        { id: 1, role_name: 'ADMIN', permission_level: 100 },
        { id: 2, role_name: 'USER', permission_level: 10 }
    ]);

    // 2. Initial-Admin & Test-User (Nominale Grundausstattung)
    const adminPass = await bcrypt.hash(process.env.INIT_ADMIN_PASS || 'admin123', 10);
    const userPass = await bcrypt.hash(process.env.INIT_USER_PASS || 'user123', 10);

    // Admin anlegen
    const [adminId] = await knex("app_users").insert({
        nickname: process.env.INIT_ADMIN_NICK || 'InitialAdmin',
        email: process.env.INIT_ADMIN_EMAIL || 'admin@example.com',
        password_hash: adminPass,
        is_active: true
    });

    // Test-User anlegen
    const [userId] = await knex("app_users").insert({
        nickname: process.env.INIT_USER_NICK || 'TestUser',
        email: process.env.INIT_USER_EMAIL || 'user@example.com',
        password_hash: userPass,
        is_active: true
    });

    // Rollen zuweisen
    await knex("app_user_roles").insert([
        { user_id: adminId, role_id: 1 }, // Admin zu ADMIN
        { user_id: userId, role_id: 2 }  // User zu USER
    ]);

    console.log("✅ Nominale User & Rollen wurden via Migration angelegt.");
}

export async function down(knex: Knex): Promise<void> {
    // 3. Revert: Tabellen komplett leeren, um den Stand vor der Migration wiederherzustellen.
    // Wegen der Fremdschlüssel löschen wir in der richtigen Reihenfolge.
    await knex("app_user_roles").truncate();
    await knex("app_users").truncate();
    await knex("app_roles").truncate();
}
