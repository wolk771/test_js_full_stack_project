/**
 * Repräsentiert die Struktur einer aktiven Sitzung in 'app_sys_sessions'.
 * Diese Daten werden auch vom Python-DB-View zur Autorisierung genutzt.
 */
export interface SessionData {
    user_id: number;
    token_hash: string;
    permission_level: number; // Konsistent zu app_roles.permission_level
    expires_at: Date;
}
