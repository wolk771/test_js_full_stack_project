import React from 'react';
import './Home.css';

export const Home: React.FC = () => {
    return (
        <div className="home-container">
            <h1 className="home-title">Willkommen beim RBAC-Prototyp</h1>
            <p className="home-description">
                Diese Web-App dient als Architektur-Studie für Fullstack-Anwendungen auf 
                <strong> netcup/Plesk</strong> Umgebungen.
            </p>

            <div className="feature-grid">
                <div className="feature-card">
                    <h3>TypeScript</h3>
                    <p>End-to-End Typensicherheit von der Datenbank bis zur UI.</p>
                </div>
                <div className="feature-card">
                    <h3>RBAC</h3>
                    <p>Sichere Rollenverteilung mit Level-basierter Zugriffskontrolle.</p>
                </div>
                <div className="feature-card">
                    <h3>Plesk-Ready</h3>
                    <p>Optimiert für Node.js Shared Hosting Infrastrukturen.</p>
                </div>
            </div>
        </div>
    );
};
