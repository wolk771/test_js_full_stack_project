"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const TABLE_NAME = "app_sys_sessions";
const VIEW_NAME = "view_python_auth";
async function up(knex) {
    return knex.transaction(async (trx) => {
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
        await trx.raw(`
      CREATE VIEW ${VIEW_NAME} AS
      SELECT token_hash, role, expires_at
      FROM ${TABLE_NAME}
    `);
    });
}
async function down(knex) {
    return knex.transaction(async (trx) => {
        await trx.raw(`DROP VIEW IF EXISTS ${VIEW_NAME}`);
        await trx.schema.dropTableIfExists(TABLE_NAME);
    });
}
