"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable("app_roles", (table) => {
        table.increments("id").primary();
        table.string("role_name").notNullable().unique();
        table.integer("permission_level").notNullable().defaultTo(10);
    });
    await knex.schema.createTable("app_users", (table) => {
        table.increments("id").primary();
        table.string("nickname").notNullable();
        table.string("email").notNullable().unique();
        table.string("password_hash").notNullable();
        table.boolean("is_active").defaultTo(false);
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });
    await knex.schema.createTable("app_user_roles", (table) => {
        table.integer("user_id").unsigned().references("id").inTable("app_users").onDelete("CASCADE");
        table.integer("role_id").unsigned().references("id").inTable("app_roles").onDelete("CASCADE");
        table.primary(["user_id", "role_id"]);
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists("app_user_roles");
    await knex.schema.dropTableIfExists("app_users");
    await knex.schema.dropTableIfExists("app_roles");
}
