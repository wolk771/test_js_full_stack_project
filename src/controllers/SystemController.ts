import { Request, Response } from 'express';
import { Knex } from 'knex'; // WICHTIG: Import für den Typ Knex
import { ApiResponse } from '../interfaces/ApiResponse';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export class SystemController {
    /**
     * Gibt die aktuelle Serverzeit formatiert zurück
     */
    public static getServerTime(_req: Request, res: Response): void {
        const now = new Date();
        const formattedDate = format(now, "EEEE, do MMMM yyyy, HH:mm:ss 'Uhr'", { locale: de });
        
        const response: ApiResponse = {
            status: 'success',
            message: 'Serverzeit erfolgreich ermittelt',
            data: {
                time: formattedDate
            }
        };
        
        res.json(response);
    }

    /**
     * Einfacher Status-Check der API
     */
    public static getStatus(_req: Request, res: Response): void {
        const response: ApiResponse = {
            status: 'success',
            message: 'API Root ist online'
        };
        res.json(response);
    }

    /**
     * Prüft Umgebungsvariablen (Nur für Testzwecke)
     */
    public static testEnv(_req: Request, res: Response): void {
        const response: ApiResponse = {
            status: 'success',
            message: 'Umgebungsvariablen-Check',
            data: {
                secret: process.env.GEHEIMNIS || 'Nicht gesetzt'
            }
        };
        res.json(response);
    }

    /**
     * Holt die Anzahl der Benutzer aus der Datenbank
     */
    public static async getUserStats(db: Knex, _req: Request, res: Response): Promise<void> {
        try {
            // Knex gibt bei count() ein Array zurück: [{ total: 2 }]
            const countResult: any = await db('app_users').count('id as total');
            const totalUsers = countResult[0].total;

            const response: ApiResponse = {
                status: 'success',
                message: 'Benutzerstatistik erfolgreich abgerufen',
                data: { total_users: totalUsers }
            };
            res.json(response);
        } catch (error: any) {
            console.error("Fehler bei getUserStats:", error);
            const errorResponse: ApiResponse = {
                status: 'error',
                message: 'Fehler beim Abrufen der Benutzeranzahl',
                errorDetails: error.message
            };
            res.status(500).json(errorResponse);
        }
    }
}
