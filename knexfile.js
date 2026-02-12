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
      // WICHTIG: Das CLI soll neue TS-Dateien immer in src/migrations anlegen
      directory: path.join(__dirname, "src", "migrations"),
      extension: "ts",
      loadExtensions: [".ts"]
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
      // WICHTIG: Auf dem Server (und beim Testen von dist) liegen die JS-Dateien hier
      directory: path.join(__dirname, "dist", "migrations"),
      extension: "js",
    }
  }
};
