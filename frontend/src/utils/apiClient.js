
import { AuthService } from '../services/AuthService';

/**
 * Ein Wrapper um fetch, der automatisch JWT-Header anfügt
 */
export const apiRequest = async (endpoint, options = {}) => {
    const token = AuthService.getToken();
    
    // Header vorbereiten
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(endpoint, { ...options, headers });
        
        // Automatisches Logout, wenn das Token abgelaufen ist (401)
        if (response.status === 401) {
            console.warn("Sitzung abgelaufen oder ungültig.");
            AuthService.logout();
            throw new Error('Sitzung abgelaufen');
        }

        return await response.json();
    } catch (error) {
        console.error(`Fehler bei Request auf ${endpoint}:`, error);
        throw error; // Fehler nach oben weiterreichen für die UI
    }
};
