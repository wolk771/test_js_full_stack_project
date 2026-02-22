import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useConfig } from '../../context/ConfigContext';
import { apiRequest } from '../../api/apiClient';
import './FlaskTest.css';

export const FlaskTest: React.FC = () => {
    const { config } = useConfig();
    const [debugInfo, setDebugInfo] = useState<any>(null);
    const [debugInfoExclusiv, setDebugInfoExclusiv] = useState<any>(null);
    const [chartUrl, setChartUrl] = useState<string | null>(null);

    const flaskUrl = config?.services.flask;

    // Hilfsfunktion für geschützte Python-Calls
    const callPythonAuth = async (path: string) => {
        setChartUrl(null);
        setDebugInfoExclusiv(null);
        // Nutzt apiRequest, muss aber die volle Flask-URL übergeben
        const result = await apiRequest<any>(`${flaskUrl}${path}`);
        setDebugInfo(result);
    };

    const callPythonAuthExclusiv = async (path: string) => {
        setChartUrl(null);
        setDebugInfo(null);
        // Nutzt apiRequest, muss aber die volle Flask-URL übergeben
        const result = await apiRequest<any>(`${flaskUrl}${path}`);
        setDebugInfoExclusiv(result);
    };

    // Spezialfunktion für das Stackplot (da es ein Bild ist)
    const loadStackPlot = () => {
        setDebugInfo(null);
        setDebugInfoExclusiv(null);
        // Da es ein Bild ist, Timestamp anhängen, um Caching zu verhindern
        setChartUrl(`${flaskUrl}/api/public/stackplot/random?t=${Date.now()}`);
    };

    return (
        <div className="service-explorer">
            <Link to="/" className="back-link">← Zurück zur Übersicht</Link>

            <header className="explorer-header">
                <h1>Flask Service Explorer</h1>
                <p className="service-url">Basis-URL: <code>{flaskUrl}</code></p>
            </header>

            {/* 1. PUBLIC CHART TEST */}
            <section className="test-section">
                <h3>1. Öffentlicher Analytics-Test</h3>
                <p>Generiert ein dynamisches Stackplot ohne Authentifizierung.</p>
                <button onClick={loadStackPlot} className="btn-test">GET /api/public/stackplot/random</button>

                {chartUrl && (
                    <div className="chart-result-container">
                        <img src={chartUrl} alt="Flask Stackplot" className="test-chart" />
                    </div>
                )}
            </section>

            {/* 2. RBAC LEVEL TESTS */}
            <section className="test-section">
                <h3>2. RBAC Level-Validierung (JWT)</h3>
                <p>Diese Aufrufe senden den Node.js-Token an Flask zur Verifizierung.</p>
                <div className="button-grid">
                    <button onClick={() => callPythonAuth('/api/user/info')} className="btn-test">User Info</button>
                    <button onClick={() => callPythonAuth('/api/moderator/dashboard')} className="btn-test">Mod Dashboard</button>
                    <button onClick={() => callPythonAuth('/api/admin/config')} className="btn-test">Admin Config</button>
                </div>
                {/* DEBUG AUSGABE */}
                {debugInfo && (
                    <div className="output-container">
                        <h4>API Antwort:</h4>
                        <pre className="debug-output">
                            {JSON.stringify(debugInfo, null, 2)}
                        </pre>
                    </div>
                )}
            </section>

            {/* 3. EXCLUSIVE ACCESS TEST */}
            <section className="test-section">
                <h3>3. Exklusiver Zugriff</h3>
                <p>Endpunkte, die NUR für eine spezifische Rolle (Level) freigegeben sind.</p>
                <button onClick={() => callPythonAuthExclusiv('/api/exclusive/moderator/logs')} className="btn-test">
                    Moderator Logs (Exklusiv)
                </button>
                {/* DEBUG AUSGABE */}
                {debugInfoExclusiv && (
                    <div className="output-container">
                        <h4>API Antwort:</h4>
                        <pre className="debug-output">
                            {JSON.stringify(debugInfoExclusiv, null, 2)}
                        </pre>
                    </div>
                )}
            </section>
        </div>
    );
};
