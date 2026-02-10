"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemController = void 0;
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
class SystemController {
    static getServerTime(_req, res) {
        const now = new Date();
        const formattedDate = (0, date_fns_1.format)(now, "EEEE, do MMMM yyyy, HH:mm:ss 'Uhr'", { locale: locale_1.de });
        const response = {
            status: 'success',
            message: 'Serverzeit erfolgreich ermittelt',
            data: {
                time: formattedDate
            }
        };
        res.json(response);
    }
    static getStatus(_req, res) {
        const response = {
            status: 'success',
            message: 'API Root ist online'
        };
        res.json(response);
    }
    static testEnv(_req, res) {
        const response = {
            status: 'success',
            message: 'Umgebungsvariablen-Check',
            data: {
                secret: process.env.GEHEIMNIS || 'Nicht gesetzt'
            }
        };
        res.json(response);
    }
}
exports.SystemController = SystemController;
