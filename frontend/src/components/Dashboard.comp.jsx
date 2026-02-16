import { useState } from 'react';
import { apiRequest } from '../utils/apiClient';
import { AuthService } from '../services/AuthService';

export function Dashboard() { 
    const [serverTime, setServerTime] = useState("");
    const [userStats, setUserStats] = useState(null);
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");

    // Wir holen uns die Rolle direkt aus dem Service
    const userRole = AuthService.getRole();

    const fetchTime = async () => {
        try {
            const result = await apiRequest('/api/server-time');
            if (result.status === 'success') setServerTime(result.data.time);
        } catch (e) {
            setError("Serverzeit konnte nicht geladen werden.");
        }
    };

     const testAccess = async (endpoint) => {
        try {
            const res = await apiRequest(endpoint);
            setMsg(`Erfolg: ${res.message}`);
        } catch (err) {
            // Hier demonstrieren wir die 401/403 Logik
            setMsg(`Fehler: ${err.message}`); 
        }
    };

    const fetchUserStats = async () => {
        setError(""); // Reset error state
        try {
            const result = await apiRequest('/api/user-stats');
            if (result.status === 'success') {
                setUserStats(result.data.total_users);
            }
        } catch (e) {
            // Hier greift dein Backend 403 Forbidden
            setError("Zugriff verweigert: Du benötigst Admin-Rechte.");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Dashboard</h2>
            <p>Willkommen, <strong>{AuthService.getNickname()}</strong>!</p>
            <p>Eingeloggt als: <b>{userRole}</b></p>

            <button onClick={() => testAccess('/api/user-area')}>User-Check (Alle)</button>
            <button onClick={() => testAccess('/api/moderator-area')}>Mod-Check (Level 50)</button>
            <button onClick={() => testAccess('/api/admin-area')}>Admin-Check (Level 100)</button>

            {msg && <div style={{marginTop: '10px', padding: '5px', border: '1px solid'}}>Antwort: {msg}</div>}

            <p>Dein Status: <span style={{ color: '#007bff' }}>{userRole}</span></p>
            
            <section style={{ marginBottom: '20px' }}>
                <button onClick={fetchTime}>Serverzeit abfragen</button>
                {serverTime && <p>🕒 {serverTime}</p>}
            </section>

            <hr />

            {/* RBAC im Frontend: Nur Admins sehen diesen Bereich */}
            {userRole === 'ADMIN' ? (
                <section style={{ marginTop: '20px', padding: '15px', border: '1px solid #81d4fa', borderRadius: '8px', backgroundColor: '#e1f5fe' }}>
                    <h4>Administrator Werkzeuge</h4>
                    <button onClick={fetchUserStats}>
                        User-Statistik abfragen
                    </button>
                    {userStats !== null && <p>Registrierte User: <strong>{userStats}</strong></p>}
                </section>
            ) : (
                <p style={{ color: '#666', fontStyle: 'italic' }}>
                    Standard-User Bereich: Weitere Funktionen sind für deine Rolle nicht verfügbar.
                </p>
            )}

            {error && <p style={{ color: 'red', marginTop: '10px' }}>⚠️ {error}</p>}
        </div>
    ); 
}
