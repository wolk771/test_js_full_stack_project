import { authService } from './authService';
import { ApiResponse } from '../types/ApiResponse';

/**
 * Ein typisierter Wrapper um fetch, der automatisch JWT-Header anfügt.
 * @template T - Der erwartete Datentyp im 'data' Feld der Antwort.
 */
export const apiRequest = async <T>(
    endpoint: string,
    options: RequestInit = {},
    skipAutoLogout: boolean = false
): Promise<ApiResponse<T>> => {

    const token = authService.getToken();

    // Header vorbereiten mit der nativen Headers-Klasse
    const headers = new Headers(options.headers);

    // Standard-Content-Type setzen, falls nicht anders angegeben
    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    // Falls ein Token existiert, sicher in den Header packen
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    try {
        const response = await fetch(endpoint, { ...options, headers });

        // Automatisches Logout bei 401 (Unauthorized)
        // !skipAutoLogout -> Flag damit beim authService.logout()
        // durch User eine Endlosschleife nicht zu reskieren 
        if (response.status === 401 && !skipAutoLogout) {
            console.warn("Sitzung abgelaufen oder ungültig.");
            authService.logout();
            // hier keinen Error, damit die UI den 401 Status verarbeiten kann
        }

        const result: ApiResponse<T> = await response.json();
        return result;

    } catch (error) {
        console.error(`Fehler bei Request auf ${endpoint}:`, error);
        // Rückgabe eines strukturierten Fehler-Objekts passend zum Interface
        return {
            status: 'error',
            message: 'Netzwerkfehler oder Server nicht erreichbar'
        };
    }
};
