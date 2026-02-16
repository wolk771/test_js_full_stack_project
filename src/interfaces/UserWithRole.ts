/**
 * Repräsentiert einen Benutzer mit seinen Rollen-Informationen.
 * Wird primär für den Login-Prozess und die Session-Verwaltung genutzt.
 */
export interface UserWithRole {
    id: number;
    nickname: string;
    email: string;
    password_hash: string;
    is_active: boolean;
    role_name: string;
    permission_level: number;
}
