import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout/MainLayout';
import { Home } from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { ConfigProvider, useConfig } from './context/ConfigContext';
import { FlaskTest } from './pages/FlaskTest/FlaskTest';
import { FastAPITest } from './pages/FastAPITest/FastAPITest';

/**
 * ProtectedRoute: Schützt Seiten vor unbefugtem Zugriff.
 * isLoading verhindert, dass der User zum Login springt, während der Token-Check läuft.
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoggedIn, isLoading } = useAuth();

    if (isLoading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Lade Berechtigungen...</div>;
    }

    return isLoggedIn ? <>{children}</> : <Navigate to="/login" />;
};

/**
 * AppRoutes: Enthält die eigentliche Navigation.
 * Wird erst gerendert, wenn die globale Config geladen wurde.
 */
const AppRoutes: React.FC = () => {
    return (
        <MainLayout>
            <Routes>
                {/* Öffentliche Seiten */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />

                {/* Geschützte Seiten - hier nutzen wir deine ProtectedRoute */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                // In AppRoutes innerhalb der App.tsx hinzufügen:
                <Route path="/flask-test" element={<FlaskTest />} />
                <Route path="/fastapi-test" element={<FastAPITest />} />


                {/* Fallback */}
                <Route path="*" element={<h2>404 - Seite nicht gefunden</h2>} />
            </Routes>
        </MainLayout>
    );
};

/**
 * AppContent: Steuert den initialen System-Start (Config-Check).
 */
const AppContent: React.FC = () => {
    const { isLoading: configLoading, error: configError } = useConfig();

    // 1. Warte auf die System-Konfiguration (Flask/FastAPI URLs)
    if (configLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px', fontFamily: 'sans-serif' }}>
                <div className="spinner">🚀</div>
                <p>System-Konfiguration wird geladen...</p>
            </div>
        );
    }

    // 2. Fehlerbehandlung, falls Node-Backend nicht antwortet
    if (configError) {
        return (
            <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
                <h2>Kritischer Konfigurationsfehler</h2>
                <p>{configError}</p>
                <button onClick={() => window.location.reload()}>Erneut versuchen</button>
            </div>
        );
    }

    // 3. Wenn Config da ist, rendere die normalen Routen
    return <AppRoutes />;
};
// Provider Level -> AuthProvider
const App: React.FC = () => {
    return (
        <ConfigProvider>
            <AuthProvider>
                <Router>
                    <AppContent />
                </Router>
            </AuthProvider>
        </ConfigProvider>
    );
};

export default App;
