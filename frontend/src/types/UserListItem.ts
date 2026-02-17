/**
 * Repräsentiert einen Benutzerdatensatz in der administrativen Liste.
 * Die Felder email und created_at sind optional, da sie je nach 
 * Berechtigungsstufe (RBAC) vom Backend gefiltert werden können.
 */
export interface UserListItem {
    id: number;
    nickname: string;
    role_name: string;
    permission_level: number;
    is_active: boolean;
    email?: string;       // Optional für Moderatoren
    created_at?: string;  // Optional für Moderatoren
}
