"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
class UserController {
    static async getAllUsers(db, req, res) {
        try {
            const requesterLevel = req.user?.level || 0;
            const allUsers = await UserRepository_1.UserRepository.getAllUsers(db);
            const filteredUsers = allUsers.map(u => {
                if (requesterLevel >= 100) {
                    return u;
                }
                else {
                    const { email, created_at, ...publicData } = u;
                    return publicData;
                }
            });
            const response = {
                status: 'success',
                message: 'Benutzerliste erfolgreich abgerufen',
                data: filteredUsers
            };
            res.json(response);
        }
        catch (error) {
            console.error("❌ Fehler in UserController.getAllUsers:", error);
            res.status(500).json({ status: 'error', message: 'Interner Serverfehler' });
        }
    }
}
exports.UserController = UserController;
