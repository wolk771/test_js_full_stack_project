import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../api/apiClient';
import { UserListItem } from '../../types/UserListItem';
import './UserTable.css';

/**
 * Komponente zur Anzeige und Verwaltung der Benutzerliste.
 * Implementiert eine rollenbasierte Sichtbarkeit (RBAC) für sensible Daten 
 * wie E-Mail-Adressen und administrative Aktionen.
 */
export const UserTable: React.FC = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState<UserListItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Lädt die Benutzerliste vom Server.
     * Der Endpunkt muss im Backend durch eine entsprechende Middleware 
     * (Level >= 50) geschützt sein.
     */
    const loadUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Wir verwenden das UserListItem Interface für die Typisierung der Antwort
            const result = await apiRequest<UserListItem[]>('/api/users');
            
            if (result.status === 'success' && result.data) {
                setUsers(result.data);
            } else {
                setError(result.message || 'Fehler beim Laden der Benutzerliste.');
            }
        } catch (err) {
            setError('Verbindung zum Server fehlgeschlagen.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    if (isLoading) return <div className="table-status">Lade Benutzerdaten...</div>;
    if (error) return <div className="table-error">⚠️ {error}</div>;

    return (
        <div className="table-container">
            <table className="user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nickname</th>
                        <th>Rolle</th>
                        {/* Dynamische Spalte: E-Mail nur für Admins (Level 100) */}
                        {user?.level === 100 && <th>E-Mail</th>}
                        <th>Status</th>
                        {/* Aktionen nur für Admins sichtbar */}
                        {user?.level === 100 && <th>Aktionen</th>}
                    </tr>
                </thead>
                <tbody>
                    {users.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.nickname}</td>
                            <td>
                                <span className={`badge level-${item.permission_level}`}>
                                    {item.role_name}
                                </span>
                            </td>
                            {/* Daten-Zelle: Nur rendern, wenn Admin eingeloggt ist */}
                            {user?.level === 100 && (
                                <td className="email-cell">{item.email || 'n/a'}</td>
                            )}
                            <td>
                                <span className={`status-pill ${item.is_active ? 'status-active' : 'status-inactive'}`}>
                                    {item.is_active ? 'Aktiv' : 'Inaktiv'}
                                </span>
                            </td>
                            {user?.level === 100 && (
                                <td>
                                    <div className="table-actions">
                                        <button className="btn-icon" title="Bearbeiten">✏️</button>
                                        <button className="btn-icon" title="Status ändern">🔄</button>
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
