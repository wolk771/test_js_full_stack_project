import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/User';
import { AuthContextType } from '../types/AuthContextType';
import { ApiResponse } from '../types/ApiResponse';
import { authService } from '../api/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider-Komponente zur zentralen Verwaltung des Authentifizierungsstatus.
 * Implementiert eine serverseitige Verifizierung der Identität zur Vermeidung 
 * von Client-seitiger Datenmanipulation.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Verifiziert das Token gegen den check-auth Endpunkt und synchronisiert
     * den Benutzerstatus sowie die SessionStorage-Metadaten.
     * @param token - Authentifizierungstoken (JWT)
     * @returns Boolean, ob die Verifizierung erfolgreich war.
     */
    const verifyIdentity = async (token: string): Promise<boolean> => {
        try {
            const response = await fetch('/api/check-auth', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result: ApiResponse<{ user: User }> = await response.json();

            if (result.status === 'success' && result.data) {
                const verifiedUser = result.data.user;
                setUser(verifiedUser);

                // Synchronisierung der Metadaten für UI-Zwecke (nicht autoritativ)
                sessionStorage.setItem('nickname', verifiedUser.nickname);
                sessionStorage.setItem('role', verifiedUser.role);
                sessionStorage.setItem('level', verifiedUser.level.toString());
                return true;
            }
            return false;
        } catch (err) {
            console.error("Identitätsprüfung fehlgeschlagen:", err);
            return false;
        }
    };

    /**
     * Startet eine neue Session durch Speicherung des Tokens und anschließende
     * serverseitige Validierung der Benutzeridentität.
     */
    const login = async (token: string): Promise<void> => {
        sessionStorage.setItem('token', token);
        const success = await verifyIdentity(token);
        if (!success) {
            logout();
            throw new Error("Authentifizierung durch Server verweigert.");
        }
    };

    /**
     * Beendet die aktuelle Session und
     * bereinigt alle sicherheitsrelevanten Speicher.
     */
    const logout = async (): Promise<void> => {
        await authService.logout(); // Jetzt mit await
        setUser(null);
    };


    /**
     * Initialer Lifecycle-Hook zur Wiederherstellung bestehender Sessions.
     */
    useEffect(() => {
        const recoverSession = async () => {
            const token = authService.getToken();
            if (token) {
                await verifyIdentity(token);
            }
            setIsLoading(false);
        };
        recoverSession();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth muss innerhalb eines AuthProviders verwendet werden');
    }
    return context;
};
