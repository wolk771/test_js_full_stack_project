import { Knex } from "knex";

const TABLE_NAME = "app_sys_sessions";
const VIEW_NAME = "view_python_auth";

export async function up(knex: Knex): Promise<void> {
  return knex.transaction(async (trx) => {
    // 1. Tabelle erstellen
    await trx.schema.createTable(TABLE_NAME, (table) => {
      table.increments("id").primary();
      table.integer("user_id").unsigned().notNullable()
           .references("id").inTable("app_users")
           .onDelete("CASCADE");
      table.string("token_hash").notNullable().index();
      table.integer("role").notNullable().defaultTo(10);
      table.dateTime("expires_at").notNullable();
      table.timestamps(true, true);
    });

    // 2. View für Python erstellen (Sicherheit durch Abstraktion)
    // Nur die Felder, die Python zur Validierung braucht
    await trx.raw(`
      CREATE VIEW ${VIEW_NAME} AS
      SELECT token_hash, role, expires_at
      FROM ${TABLE_NAME}
    `);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.transaction(async (trx) => {
    // Erst den View, dann die Tabelle löschen
    await trx.raw(`DROP VIEW IF EXISTS ${VIEW_NAME}`);
    await trx.schema.dropTableIfExists(TABLE_NAME);
  });
}
