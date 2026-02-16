import { Knex } from 'knex';
import { UserWithRole } from '../interfaces/UserWithRole';
import { UserBase } from '../interfaces/UserBase';

export class UserRepository {

    /**
     * Sucht einen Basis-Datensatz eines Benutzers anhand der E-Mail-Adresse.
     * @param db - Die Knex-Instanz oder eine laufende Transaktion.
     * @param email - Die zu suchende E-Mail-Adresse.
     * @returns Ein Promise, das den User (UserBase) oder null zurückgibt.
     */
    public static async findByEmail(db: Knex | Knex.Transaction, email: string): Promise<UserBase | null> {
        return db('app_users').where({ email }).first();
    }

    /**
     * Sucht einen Benutzer inkl. seiner Rolle mit dem höchsten Berechtigungslevel.
     * @param db - Die Knex-Instanz.
     * @param email - Die E-Mail-Adresse des Benutzers.
     * @returns Ein Promise mit UserWithRole Daten oder null.
     */
    public static async findByEmailWithRole(db: Knex, email: string): Promise<UserWithRole | null> {
        const user = await db('app_users as u')
            .select(
                'u.id',
                'u.nickname',
                'u.email',
                'u.password_hash',
                'u.is_active',
                'r.role_name',
                'r.permission_level'
            )
            .leftJoin('app_user_roles as ur', 'u.id', 'ur.user_id')
            .leftJoin('app_roles as r', 'ur.role_id', 'r.id')
            .where('u.email', email)
            .orderBy('r.permission_level', 'desc')
            .first();

        // Falls kein User gefunden wurde oder der Join keine Rolle liefert (Sicherheit)
        if (!user || !user.role_name) return null;

        return user;
    }

    /**
     * Prüft, ob eine bestimmte Rolle mindestens einer Person zugewiesen ist.
     * @param db - Die Knex-Instanz oder Transaktion.
     * @param roleId - Die ID der zu prüfenden Rolle.
     * @returns True, wenn mindestens eine Zuweisung existiert.
     */
    public static async hasRoleAssignment(db: Knex | Knex.Transaction, roleId: number): Promise<boolean> {
        const assignment = await db('app_user_roles').where({ role_id: roleId }).first();
        return !!assignment;
    }

    /**
     * Erstellt einen neuen Benutzer und verknüpft ihn direkt mit einer Rolle.
     * @param db - Knex-Instanz oder Transaktions-Objekt (für atomare Operationen).
     * @param userData - Die Grunddaten des Benutzers (Nickname, Email, Passwort-Hash, Status).
     * @param roleId - Die ID der zuzuweisenden Rolle.
     * @returns Die ID des neu angelegten Benutzers.
     */
    public static async createWithRole(
        db: Knex | Knex.Transaction,
        userData: { nickname: string; email: string; password_hash: string; is_active: boolean },
        roleId: number
    ): Promise<number> {
        // 1. User in app_users anlegen
        const [insertedId] = await db('app_users').insert(userData);

        // 2. Sicherstellen, dass die ID eine Zahl ist
        const userId = Number(insertedId);

        // 3. Verknüpfung in app_user_roles erstellen
        await db('app_user_roles').insert({
            user_id: userId,
            role_id: roleId
        });

        return userId;
    }

    /**
     * Findet die ID einer Rolle anhand ihres Namens (z.B. 'ADMIN').
     * @param db - Die Knex-Instanz oder Transaktion.
     * @param roleName - Der Name der Rolle (Case-Sensitive).
     * @returns Die ID der Rolle oder null, wenn nicht gefunden.
     */
    public static async findRoleIdByName(db: Knex | Knex.Transaction, roleName: string): Promise<number | null> {
        const role = await db('app_roles').where({ role_name: roleName }).first();
        return role ? Number(role.id) : null;
    }

    /**
     * Prüft, ob ein spezifischer Benutzer bereits eine bestimmte Rolle zugewiesen hat.
     */
    public static async hasSpecificRole(
        db: Knex | Knex.Transaction,
        userId: number,
        roleId: number
    ): Promise<boolean> {
        const exists = await db('app_user_roles')
            .where({ user_id: userId, role_id: roleId })
            .first();
        return !!exists;
    }

    /**
     * Weist einem existierenden Benutzer eine Rolle zu (ohne den User neu zu erstellen).
     */
    public static async assignRole(
        db: Knex | Knex.Transaction,
        userId: number,
        roleId: number
    ): Promise<void> {
        await db('app_user_roles').insert({ user_id: userId, role_id: roleId });
    }

}
