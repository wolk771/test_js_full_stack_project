import { User } from './User';

/**
 * Interface für den globalen Authentifizierungs-Kontext.
 * Verwaltet den Identitätsstatus und stellt Methoden zur Session-Steuerung bereit.
 */
export interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    /**
     * Initiiert den Login-Prozess und verifiziert die Identität gegen die API.
     * @param token - Das vom Auth-Endpunkt ausgestellte JWT.
     */
    login: (token: string) => Promise<void>; 
    logout: () => void;
}
