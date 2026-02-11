import { Request, Response } from 'express';
import { Knex } from 'knex'; // Importiere den Typ von Knex
import { ApiResponse } from '../interfaces/ApiResponse';

export class DatabaseController {
    /**
     * Testet die Verbindung via Knex
     */
    public static async testConnection(db: Knex, _req: Request, res: Response): Promise<void> {
        try {
            // Knex nutzt 'raw' für direkte SQL-Befehle
            const result = await db.raw('SELECT VERSION() as v');
            
            // Bei MySQL gibt raw ein Array zurück, wobei das erste Element die Zeilen sind
            const version = result[0][0].v;

            const response: ApiResponse = {
                status: 'success',
                message: 'Datenbankverbindung via Knex erfolgreich',
                data: { mysqlVersion: version }
            };
            res.json(response);
        } catch (e: any) {
            const errorResponse: ApiResponse = {
                status: 'error',
                message: 'Knex konnte keine Verbindung herstellen',
                errorDetails: e.message
            };
            res.status(500).json(errorResponse);
        }
    }
}
