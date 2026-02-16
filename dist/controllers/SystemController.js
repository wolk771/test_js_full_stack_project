"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemController = void 0;
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
const env_1 = require("../config/env");
class SystemController {
    static getServerTime(_req, res) {
        const now = new Date();
        const formattedDate = (0, date_fns_1.format)(now, "EEEE, do MMMM yyyy, HH:mm:ss 'Uhr'", { locale: locale_1.de });
        const response = {
            status: 'success',
            message: 'Serverzeit erfolgreich ermittelt',
            data: { time: formattedDate }
        };
        res.json(response);
    }
    static getStatus(_req, res) {
        const response = {
            status: 'success',
            message: 'API Root ist online',
            data: { mode: env_1.ENV.NODE_ENV }
        };
        res.json(response);
    }
    static testEnv(_req, res) {
        const response = {
            status: 'success',
            message: 'Umgebungsvariablen-Check (Validiert)',
            data: {
                node_env: env_1.ENV.NODE_ENV,
                db_host: env_1.ENV.DB_HOST,
                port: env_1.ENV.PORT
            }
        };
        res.json(response);
    }
    static async getUserStats(db, _req, res) {
        try {
            const countResult = await db('app_users').count('id as total');
            const totalUsers = countResult[0]?.total ?? 0;
            const response = {
                status: 'success',
                message: 'Benutzerstatistik erfolgreich abgerufen',
                data: { total_users: totalUsers }
            };
            res.json(response);
        }
        catch (error) {
            console.error("❌ Fehler bei getUserStats:", error);
            const errorResponse = {
                status: 'error',
                message: 'Fehler beim Abrufen der Benutzeranzahl',
                errorDetails: env_1.ENV.NODE_ENV === 'development' ? error.message : undefined
            };
            res.status(500).json(errorResponse);
        }
    }
    static checkAuth(req, res) {
        if (!req.user) {
            const response = {
                status: 'error',
                message: 'Authentifizierung fehlgeschlagen: Keine User-Daten im Request.'
            };
            res.status(401).json(response);
            return;
        }
        const response = {
            status: 'success',
            message: 'Authentifizierung ist gültig',
            data: {
                user: req.user
            }
        };
        res.json(response);
    }
}
exports.SystemController = SystemController;
