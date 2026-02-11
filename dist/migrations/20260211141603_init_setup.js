"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.createTable("app_logs", (table) => {
        table.increments("id").primary();
        table.string("event").notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });
}
async function down(knex) {
    return knex.schema.dropTable("app_logs");
}
