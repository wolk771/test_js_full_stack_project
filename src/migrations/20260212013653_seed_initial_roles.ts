import { Knex } from "knex";
import bcrypt from "bcrypt";
import { ENV } from "../config/env";

export async function up(knex: Knex): Promise<void> {
    // 1. Rollen einfügen
    await knex("app_roles").insert([
        { role_name: 'ADMIN', permission_level: 100 }, 
        { role_name: 'USER', permission_level: 10 }   
    ]);

    // 2. IDs der gerade erstellten Rollen dynamisch abrufen
    const adminRole = await knex("app_roles").where({ role_name: 'ADMIN' }).first();
    const userRole = await knex("app_roles").where({ role_name: 'USER' }).first();

    if (!adminRole || !userRole) {
        throw new Error("❌ Kritischer Fehler: Rollen konnten nicht korrekt angelegt werden.");
    }

    // 3. Passwörter hashen
    const adminPass = await bcrypt.hash(ENV.INIT_ADMIN_PASS, ENV.BCRYPT_ROUNDS);
    const userPass = await bcrypt.hash(ENV.INIT_USER_PASS, ENV.BCRYPT_ROUNDS);

    // 4. Initial-Admin anlegen
    const [insertedAdminId] = await knex("app_users").insert({
        nickname: ENV.INIT_ADMIN_NICK,
        email: ENV.INIT_ADMIN_EMAIL,
        password_hash: adminPass,
        is_active: true
    });
    const adminId = Number(insertedAdminId);

    // 5. Test-User anlegen
    const [insertedUserId] = await knex("app_users").insert({
        nickname: ENV.INIT_USER_NICK,
        email: ENV.INIT_USER_EMAIL,
        password_hash: userPass,
        is_active: true
    });
    const userId = Number(insertedUserId);

    // 6. Rollen zuweisen
    await knex("app_user_roles").insert([
        { user_id: adminId, role_id: adminRole.id }, 
        { user_id: userId, role_id: userRole.id }  
    ]);

    console.log("✅ Nominale User & Rollen wurden angelegt.");
}

export async function down(knex: Knex): Promise<void> {
    // Wichtig: Wegen Foreign-Key-Constraints in der richtigen Reihenfolge
    await knex("app_user_roles").truncate();
    await knex("app_users").truncate();
    await knex("app_roles").truncate();
}
