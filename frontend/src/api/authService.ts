import { apiRequest } from "./apiClient";

export interface AuthResponse {
    status: string;
    message: string;
    data?: {
        token: string;
        nickname: string;
        role: string;
        level: number;
    };
}

export const authService = {
    getToken: (): string | null => sessionStorage.getItem('token'),
    getRole: (): string | null => sessionStorage.getItem('role'),
    getNickname: (): string | null => sessionStorage.getItem('nickname'),
    
    /**
     * Beendet die Session sowohl serverseitig als auch lokal.
     */
    logout: async (): Promise<void> => {
        const token = sessionStorage.getItem('token');
        
        if (token) {
        try {
            // apiRequest, aber ohne Auto-Logout bei 401
            await apiRequest('/api/logout', { method: 'POST' }, true);
        } catch (err) {
            console.warn("Server-Logout fehlgeschlagen", err);
        }
    }

        // Lokalen Speicher immer leeren, egal ob der Server-Call erfolgreich war
        sessionStorage.clear();
        window.location.href = '/login';
    }
};
