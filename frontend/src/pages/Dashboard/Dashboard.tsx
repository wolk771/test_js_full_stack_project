import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserTable } from '../../components/UserTable/UserTable'; // NEU: Import der Tabelle
import './Dashboard.css';

/**
 * Dashboard-Zentrale: Aggregiert verschiedene Module basierend auf dem 
 * Berechtigungslevel (RBAC) des angemeldeten Benutzers.
 */
export const Dashboard: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Mein Dashboard</h1>
                {/* Visualisierung des Benutzerstatus via CSS-Badges */}
                <div className={`badge level-${user?.level}`}>
                    {user?.role} (Level {user?.level})
                </div>
            </header>

            <div className="dashboard-grid">
                {/* --- Modul: Profil (Öffentlich für alle Authentifizierten) --- */}
                <section className="dashboard-card">
                    <h3>👤 Profil-Übersicht</h3>
                    <p><strong>Nickname:</strong> {user?.nickname}</p>
                    <p><strong>E-Mail:</strong> {user?.email}</p>
                </section>

                {/* --- Modul: Moderation (Level >= 50) --- */}
                {user && user.level >= 50 && (
                    <section className="dashboard-card highlight">
                        <h3>🛡️ Moderations-Bereich</h3>
                        <p>Inhalte prüfen und Community-Anfragen verwalten.</p>
                        <button className="action-btn">Meldungen öffnen</button>
                    </section>
                )}

                {/* --- Modul: Administration & Moderation (Level >= 50) --- */}
                {user && user.level >= 50 && (
                    <section className={`dashboard-card ${user.level === 100 ? 'danger' : 'highlight'}`}>
                        <h3>{user.level === 100 ? '⚙️ System-Verwaltung' : '🛡️ Benutzer-Übersicht'}</h3>
                        <p>
                            {user.level === 100
                                ? 'Vollständige Kontrolle über Benutzerdaten und Systemstatus.'
                                : 'Eingeschränkte Sicht auf die Benutzerliste (Moderations-Modus).'}
                        </p>

                        {/* Die UserTable wird für beide gerendert */}
                        <UserTable />
                    </section>
                )}
                
            </div>
        </div>
    );
};
