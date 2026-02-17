import React, { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './MainLayout.css';

interface MainLayoutProps {
    children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const { user, isLoggedIn, logout } = useAuth();

    return (
        <div className="layout-container">
            <header className="layout-header">
                <div className="brand-logo">🚀 RBAC-Prototyp</div>
                
                <nav className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    
                    {isLoggedIn ? (
                        <div className="user-info">
                            <Link to="/dashboard" className="nav-link">Dashboard</Link>
                            <span>
                                Hallo, <b>{user?.nickname}</b> <small>({user?.role})</small>
                            </span>
                            <button onClick={logout} className="logout-btn">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="login-btn">Anmelden</Link>
                    )}
                </nav>
            </header>

            <main className="layout-main">
                <div className="content-wrapper">
                    {children}
                </div>
            </main>

            <footer className="layout-footer">
                © 2026 Fullstack Architektur-Prototyp | Status: 
                <span className={isLoggedIn ? 'status-active' : 'status-guest'}>
                    {isLoggedIn ? ' Angemeldet' : ' Gast-Modus'}
                </span>
            </footer>
        </div>
    );
};
