/**
 * Repräsentiert die reinen Daten aus der Tabelle 'app_users'.
 */
export interface UserBase {
    id: number;
    nickname: string;
    email: string;
    password_hash: string;
    is_active: boolean;
    created_at?: Date;
}
