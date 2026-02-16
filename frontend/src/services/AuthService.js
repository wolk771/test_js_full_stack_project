
export const AuthService = {
    login: async (email, password) => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const result = await response.json();

            if (result.status === 'success' && result.data?.token) {
                sessionStorage.setItem('token', result.data.token);
                sessionStorage.setItem('nickname', result.data.nickname);
                sessionStorage.setItem('role', result.data.role); 
                sessionStorage.setItem('level', result.data.level); 
                return { success: true };
            }
            return { success: false, message: result.message };
        } catch (error) { return { success: false, message: 'Server-Fehler' }; }
    },
    // ... andere Methoden
    getToken: () => sessionStorage.getItem('token'),
    getRole: () => sessionStorage.getItem('role'),
    getNickname: () => sessionStorage.getItem('nickname'),
    logout: () => {
        sessionStorage.clear();
        window.location.href = '/';
    }
};
