"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseController = void 0;
class DatabaseController {
    static async testConnection(pool, _req, res) {
        try {
            const [rows] = await pool.query('SELECT VERSION() as v');
            const response = {
                status: 'success',
                message: 'Datenbankverbindung erfolgreich',
                data: {
                    mysqlVersion: rows[0].v
                }
            };
            res.json(response);
        }
        catch (e) {
            const errorResponse = {
                status: 'error',
                message: 'Datenbankverbindung fehlgeschlagen',
                errorDetails: e.message
            };
            res.status(500).json(errorResponse);
        }
    }
}
exports.DatabaseController = DatabaseController;
