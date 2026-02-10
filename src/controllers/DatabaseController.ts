import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { ApiResponse } from '../interfaces/ApiResponse';

export class DatabaseController {
    /**
     * Testet die Verbindung zur Datenbank und gibt die Version zurück
     */
    public static async testConnection(pool: Pool, _req: Request, res: Response): Promise<void> {
        try {
            // Typ-Cast auf any[], damit .v zugreifen
            const [rows] = await pool.query('SELECT VERSION() as v') as any[];
            
            const response: ApiResponse = {
                status: 'success',
                message: 'Datenbankverbindung erfolgreich',
                data: {
                    mysqlVersion: rows[0].v
                }
            };
            res.json(response);
        } catch (e: any) {
            const errorResponse: ApiResponse = {
                status: 'error',
                message: 'Datenbankverbindung fehlgeschlagen',
                errorDetails: e.message
            };
            res.status(500).json(errorResponse);
        }
    }
}
