import { Response } from 'express';
import { Knex } from 'knex';
import { ApiResponse } from '../interfaces/ApiResponse';
import { AuthRequest } from '../interfaces/AuthRequest';
import { UserRepository } from '../repositories/UserRepository';

/**
 * Controller für administrative Benutzeroperationen.
 */
export class UserController {
    /**
     * Ruft die Liste aller Benutzer ab und filtert sensible Daten 
     * basierend auf dem Berechtigungslevel des Anfragenden.
     */
    public static async getAllUsers(db: Knex, req: AuthRequest, res: Response): Promise<void> {
        try {
            const requesterLevel = req.user?.level || 0;
            const allUsers = await UserRepository.getAllUsers(db);

            // Filterung: Nur Admins (100) sehen E-Mails und Zeitstempel
            const filteredUsers = allUsers.map(u => {
                if (requesterLevel >= 100) {
                    return u; // Admin sieht alles
                } else {
                    // Moderatoren (Level 50) sehen eingeschränkte Daten
                    const { email, created_at, ...publicData } = u;
                    return publicData;
                }
            });

            const response: ApiResponse = {
                status: 'success',
                message: 'Benutzerliste erfolgreich abgerufen',
                data: filteredUsers
            };
            res.json(response);
        } catch (error: any) {
            console.error("❌ Fehler in UserController.getAllUsers:", error);
            res.status(500).json({ status: 'error', message: 'Interner Serverfehler' });
        }
    }
}
