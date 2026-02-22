import React from 'react';
import { useConfig } from '../../context/ConfigContext';
import './Home.css';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {

    const { config } = useConfig();

    // Basis-URLs aus der dynamischen Konfiguration
    const flaskUrl = config?.services.flask;
    const fastApiUrl = config?.services.fastAPI;

    return (
        <div className="home-container">
            <header className="home-hero">
                <h1 className="home-title">Willkommen bei Fullstack Architektur-Prototyp</h1>
                <p className="home-description">
                    Diese Web-App dient als Architektur-Studie für Fullstack-Anwendungen auf
                    <strong> netcup/Plesk</strong> Umgebungen.
                <br/>
                    Sowie Integration von <strong>Node.js</strong>, <strong>React</strong> und
                    <strong> Python-Services</strong> auf einer Plesk-Infrastruktur.
                </p>
            </header>

            {/* ARCHITEKTUR-VISUALISIERUNG */}
            <section className="integration-section">
                <div className="section-header">
                    <h2>Live-Architektur-Visualisierung</h2>
                    <p>Dynamische Abfrage des System-Status direkt vom Flask-Backend.</p>
                </div>

                {flaskUrl ? (
                    <div className="chart-container">
                        <img
                            src={`${flaskUrl}/api/public/tech-stack-chart`}
                            alt="Architektur Verteilung"
                            className="architecture-chart"
                        />
                    </div>
                ) : (
                    <div className="loading-placeholder">Verbindung zu Services wird geprüft...</div>
                )}
            </section>
            <div className="feature-grid">
                <div className="feature-card service-card">
                    <div className="card-badge">Node</div>
                    <h3>TypeScript</h3>
                    <p>End-to-End Typensicherheit von der Datenbank bis zur UI.</p>
                </div>
                <div className="feature-card service-card">
                    <div className="card-badge">Zugriff</div>
                    <h3>RBAC</h3>
                    <p>Sichere Rollenverteilung mit Level-basierter Zugriffskontrolle.</p>
                </div>
                <div className="feature-card service-card">
                    <div className="card-badge">Webhosting</div>
                    <h3>Plesk-Ready</h3>
                    <p>Optimiert für Node.js Shared Hosting Infrastrukturen.</p>
                </div>
            </div>

            <div className="feature-grid">
                {/* FLASK CARD */}
                <div className="feature-card service-card">
                    <div className="card-badge">Service A</div>
                    <h3>Flask Integration</h3>
                    <p>Fokus auf Analytics & Charts. Erste RBAC-Schnittstellen sind im Aufbau.</p>
                    <div className="card-actions">
                        <Link to="/flask-test" className="btn-internal">Explorer</Link>
                        <a href={`${flaskUrl}/docs`} target="_blank" rel="noreferrer" className="btn-external">Docs ↗</a>
                    </div>
                </div>

                {/* FASTAPI CARD */}
                <div className="feature-card service-card">
                    <div className="card-badge">Service B</div>
                    <h3>FastAPI Integration</h3>
                    <p>Hochperformante Endpunkte für komplexe Datenverarbeitung. Erste RBAC-Schnittstellen sind im Aufbau.</p>
                    <div className="card-actions">
                        <Link to="/fastapi-test" className="btn-internal">Explorer</Link>
                        <a href={`${fastApiUrl}/docs`} target="_blank" rel="noreferrer" className="btn-external">Docs ↗</a>
                    </div>

                </div>
                {/* CORE SYSTEM */}
                <div className="feature-card service-card">
                    <div className="card-badge">Core</div>
                    <h3>Zentrale Steuerung</h3>
                    <p>Node.js Backend verwaltet Identitäten (RBAC) und API-Gateway-Logik.</p>
                </div>
            </div>
        </div>
    );
};
