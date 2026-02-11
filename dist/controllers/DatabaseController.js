"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseController = void 0;
class DatabaseController {
    static async testConnection(db, _req, res) {
        try {
            const result = await db.raw('SELECT VERSION() as v');
            const version = result[0][0].v;
            const response = {
                status: 'success',
                message: 'Datenbankverbindung via Knex erfolgreich',
                data: { mysqlVersion: version }
            };
            res.json(response);
        }
        catch (e) {
            const errorResponse = {
                status: 'error',
                message: 'Knex konnte keine Verbindung herstellen',
                errorDetails: e.message
            };
            res.status(500).json(errorResponse);
        }
    }
}
exports.DatabaseController = DatabaseController;
