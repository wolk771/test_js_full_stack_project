import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout/MainLayout';
import { Home } from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import { Dashboard } from './pages/Dashboard/Dashboard';

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

// AppRoutes: Consumer Level -> useAuth-Hook
// React.FC: Typisierung  -> Functional Component
const AppRoutes: React.FC = () => {
    return (
        <MainLayout>
            <Routes>
                {/* Öffentliche Seiten */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                
                {/* Geschützte Seiten */}
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } 
                />
                
                {/* Fallback */}
                <Route path="*" element={<h2>404 - Seite nicht gefunden</h2>} />
            </Routes>
        </MainLayout>
    );
};
// Provider Level -> AuthProvider
const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
};

export default App;
