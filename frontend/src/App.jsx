// frontend/src/App.jsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthService } from './services/AuthService';
import LoginForm from './components/LoginForm.comp.jsx';
import { Home } from './components/Home.comp.jsx';
import { Dashboard } from './components/Dashboard.comp.jsx';

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!AuthService.getToken());

    const handleLogout = () => {
        AuthService.logout();
        setIsLoggedIn(false);
    };

    return (
        <BrowserRouter>
            <nav style={{ padding: '15px', background: '#2c3e50', color: 'white', display: 'flex', gap: '15px', alignItems: 'center' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>🏠 Home</Link>
                
                {isLoggedIn ? (
                    <>
                        <Link to="/dashboard" style={{ color: '#3498db', textDecoration: 'none' }}>📊 Dashboard</Link>
                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span>👤 <b>{AuthService.getNickname()}</b> ({AuthService.getRole()})</span>
                            <button onClick={handleLogout} style={{ cursor: 'pointer', padding: '5px 10px' }}>Abmelden</button>
                        </div>
                    </>
                ) : (
                    <div style={{ marginLeft: 'auto' }}>
                        {/* Hier die Nachbesserung: "Bitte anmelden" führt zum Login-Formular */}
                        <Link to="/login" style={{ color: '#f1c40f', textDecoration: 'none', fontWeight: 'bold' }}>🔑 Bitte anmelden</Link>
                    </div>
                )}
            </nav>

            <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    
                    {/* Login Route */}
                    <Route 
                        path="/login" 
                        element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />} 
                    />

                    {/* Dashboard Schutz */}
                    <Route 
                        path="/dashboard" 
                        element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} 
                    />

                    <Route path="*" element={<h2>404 - Seite nicht gefunden</h2>} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}
