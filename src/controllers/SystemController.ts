import { Request, Response } from 'express';
import { Knex } from 'knex';
import { ApiResponse } from '../interfaces/ApiResponse';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { AuthRequest } from '../interfaces/AuthRequest';
import { ENV } from '../config/env';

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
            data: { time: formattedDate }
        };
        res.json(response);
    }

    /**
     * Einfacher Status-Check der API
     */
    public static getStatus(_req: Request, res: Response): void {
        const response: ApiResponse = {
            status: 'success',
            message: 'API Root ist online',
            data: { mode: ENV.NODE_ENV }
        };
        res.json(response);
    }

    /**
     * Prüft Umgebungsvariablen
     */
    public static testEnv(_req: Request, res: Response): void {
        const response: ApiResponse = {
            status: 'success',
            message: 'Umgebungsvariablen-Check (Validiert)',
            data: {
                node_env: ENV.NODE_ENV,
                db_host: ENV.DB_HOST,
                port: ENV.PORT
            }
        };
        res.json(response);
    }

    /**
     * Holt die Anzahl der Benutzer aus der Datenbank
     */
    public static async getUserStats(db: Knex, _req: AuthRequest, res: Response): Promise<void> {
        try {
            // Korrekte Knex-Typisierung für count: Es ist ein Array von Objekten
            const countResult = await db('app_users').count('id as total') as Array<{ total: number }>;

            // Sicherstellen, dass das Ergebnis existiert
            const totalUsers = countResult[0]?.total ?? 0;

            const response: ApiResponse = {
                status: 'success',
                message: 'Benutzerstatistik erfolgreich abgerufen',
                data: { total_users: totalUsers }
            };
            res.json(response);
        } catch (error: any) {
            console.error("❌ Fehler bei getUserStats:", error);
            const errorResponse: ApiResponse = {
                status: 'error',
                message: 'Fehler beim Abrufen der Benutzeranzahl',
                errorDetails: ENV.NODE_ENV === 'development' ? error.message : undefined
            };
            res.status(500).json(errorResponse);
        }
    }

    /**
     * Bestätigt die Gültigkeit des Tokens und gibt die User-Daten zurück.
     * Wird vom Frontend beim App-Start/Refresh aufgerufen.
     */
    public static checkAuth(req: AuthRequest, res: Response): void {
        // Sicherstellen, dass req.user existiert (Defensive Coding)
        if (!req.user) {
            const response: ApiResponse = {
                status: 'error',
                message: 'Authentifizierung fehlgeschlagen: Keine User-Daten im Request.'
            };
            res.status(401).json(response);
            return;
        }

        const response: ApiResponse = {
            status: 'success',
            message: 'Authentifizierung ist gültig',
            data: { 
                // Wir geben nur das zurück, was das Frontend wirklich für die UI-Steuerung braucht
                user: req.user 
            } 
        };
        res.json(response);
    }

}
