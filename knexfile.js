const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

module.exports = {
    development: {
        client: "mysql2",
        connection: {
            host: process.env.DB_HOST || "127.0.0.1",
            port: Number(process.env.DB_PORT) || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        },
        migrations: {
            // WICHTIG: 'node dist/app.js' ausführen, 
            // -> JS-Migrationen im dist-Ordner nutzen!
            directory: "./dist/migrations",
            extension: "js",
        }
    },
    production: {
        client: "mysql2",
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: 3306,
        },
        migrations: {
            directory: path.join(__dirname, "dist", "migrations"),
            extension: "js", // Auf netcup liegen sie kompiliert als JS vor
        }
    }
};
