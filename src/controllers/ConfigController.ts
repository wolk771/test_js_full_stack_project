import { Request, Response } from 'express';
import { ApiResponse } from '../interfaces/ApiResponse';
import { publicConfig } from '../config/env';

/**
 * Controller für Integrations-Parameter (Python Services etc.)
 */
export class ConfigController {
    /**
     * Liefert das Setup für externe Service-Integrationen (Flask, FastAPI).
     * Pfad: GET /api/integration/setup
     */
    public static getIntegrationSetup(_req: Request, res: Response): void {
        try {
            const response: ApiResponse = {
                status: 'success',
                message: 'Integrations-Setup erfolgreich geladen',
                data: publicConfig
            };
            res.json(response);
        } catch (error: any) {
            const errorResponse: ApiResponse = {
                status: 'error',
                message: 'Fehler beim Laden des Integrations-Setups'
            };
            res.status(500).json(errorResponse);
        }
    }
}
