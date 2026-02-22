"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigController = void 0;
const env_1 = require("../config/env");
class ConfigController {
    static getIntegrationSetup(_req, res) {
        try {
            const response = {
                status: 'success',
                message: 'Integrations-Setup erfolgreich geladen',
                data: env_1.publicConfig
            };
            res.json(response);
        }
        catch (error) {
            const errorResponse = {
                status: 'error',
                message: 'Fehler beim Laden des Integrations-Setups'
            };
            res.status(500).json(errorResponse);
        }
    }
}
exports.ConfigController = ConfigController;
