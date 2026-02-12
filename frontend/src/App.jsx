import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthService } from './services/AuthService';
import { apiRequest } from './utils/apiClient';
import LoginForm from './components/LoginForm.comp.jsx';

function Home() { 
    return (
        <div>
            <h2>Frontend Home</h2>
            <p>Dies ist ein öffentlicher Bereich.</p>
        </div>
    ); 
}

function Dashboard() { 
    const [serverTime, setServerTime] = useState("");
    const [userStats, setUserStats] = useState(null);

    const fetchTime = async () => {
        const result = await apiRequest('/api/server-time');
        if (result.status === 'success') setServerTime(result.data.time);
    };

    const fetchUserStats = async () => {
        try {
            const result = await apiRequest('/api/user-stats');
            if (result.status === 'success') setUserStats(result.data.total_users);
        } catch (e) {
            alert("Zugriff verweigert oder Fehler.");
        }
    };

    return (
        <>
            <h2>Dashboard Bereich (Geschützt)</h2>
            <p>Willkommen, {AuthService.getNickname()}!</p>
            
            <button onClick={fetchTime}>Serverzeit abfragen</button>
            {serverTime && <p>Antwort: {serverTime}</p>}
            
            <hr />
            {/* Dein neuer Button für die User-Stats */}
            <button onClick={fetchUserStats} style={{ backgroundColor: '#e1f5fe' }}>
                User-Statistik abfragen (Admin-Test)
            </button>
            {userStats !== null && <p>Registrierte User im System: {userStats}</p>}
        </>
    ); 
}

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!AuthService.getToken());

    return (
        <BrowserRouter>
            <nav style={{ padding: '10px', background: '#eee' }}>
                <Link to="/">Home</Link> | <Link to="/dashboard">Dashboard</Link>
                {isLoggedIn && (
                    <button onClick={() => AuthService.logout()} style={{ marginLeft: '20px' }}>
                        Abmelden
                    </button>
                )}
            </nav>
            <hr />

            {!isLoggedIn ? (
                /* Falls nicht eingeloggt, zeigen wir auf jeder Seite das Login-Feld an */
                <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
            ) : (
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="*" element={<h2>404 - Nicht gefunden</h2>} />
                </Routes>
            )}
        </BrowserRouter>
    );
}
