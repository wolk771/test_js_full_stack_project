import { Request, Response } from 'express';
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
        
        // TypeScript prüft hier, ob das Objekt zum Interface ApiResponse passt
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
}
