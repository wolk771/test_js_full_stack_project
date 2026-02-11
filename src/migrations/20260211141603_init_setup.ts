import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Tabelle 'app_logs'
    return knex.schema.createTable("app_logs", (table) => {
        table.increments("id").primary();            // Automatische ID
        table.string("event").notNullable();         // Ein Text-Feld für das Ereignis
        table.timestamp("created_at").defaultTo(knex.fn.now()); // Zeitstempel
    });
}

export async function down(knex: Knex): Promise<void> {
    // Änderungen rückgängig machen(für Revert/Rollback)
    return knex.schema.dropTable("app_logs");
}

