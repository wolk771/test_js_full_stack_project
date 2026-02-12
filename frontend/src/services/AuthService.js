
const API_URL = '/api';

export const AuthService = {
    /**
     * Sendet Login-Daten an das Backend und speichert das Token
     */
    login: async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (result.status === 'success' && result.data?.token) {
                // Token & Info sicher im SessionStorage ablegen
                sessionStorage.setItem('token', result.data.token);
                sessionStorage.setItem('nickname', result.data.nickname);
                return { success: true, data: result.data };
            } else {
                return { success: false, message: result.message || 'Login fehlgeschlagen' };
            }
        } catch (error) {
            console.error("Netzwerkfehler beim Login:", error);
            return { success: false, message: 'Server nicht erreichbar. Bitte später versuchen.' };
        }
    },

    getToken: () => sessionStorage.getItem('token'),
    getNickname: () => sessionStorage.getItem('nickname'),

    logout: () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('nickname');
        // Wir erzwingen einen Reload, um den App-Status zu säubern
        window.location.href = '/';
    }
};
