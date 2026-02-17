
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
    
    logout: (): void => {
        sessionStorage.clear();
        window.location.href = '/login';
    }
};
