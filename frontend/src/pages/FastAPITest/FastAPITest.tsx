import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useConfig } from '../../context/ConfigContext';
import { apiRequest } from '../../api/apiClient';
import '../FlaskTest/FlaskTest.css'; // Wir nutzen das gleiche CSS für Konsistenz

export const FastAPITest: React.FC = () => {
    const { config } = useConfig();
    const [debugInfo, setDebugInfo] = useState<any>(null);
    const [debugInfoExclusiv, setDebugInfoExclusiv] = useState<any>(null);
    const [chartUrl, setChartUrl] = useState<string | null>(null);

    const fastApiUrl = config?.services.fastAPI;

    const callFastApiAuth = async (path: string) => {
        setChartUrl(null);
        setDebugInfoExclusiv(null);
        // true -> Sichtbarkeit von Errors bei unangemeldeten Users
        //  bei 401 -> also nicht zum Login
        const result = await apiRequest<any>(`${fastApiUrl}${path}`, {}, true);
        setDebugInfo(result);
    };

    const callFastApiExclusiv = async (path: string) => {
        setChartUrl(null);
        setDebugInfo(null);
        // true -> Sichtbarkeit von Errors bei unangemeldeten Users
        // bei 401 -> also nicht zum Login
        const result = await apiRequest<any>(`${fastApiUrl}${path}`, {}, true);
        setDebugInfoExclusiv(result);
    };

    const loadFastApiChart = () => {
        setDebugInfo(null);
        setDebugInfoExclusiv(null);
        setChartUrl(`${fastApiUrl}/api/public/chart?t=${Date.now()}`);
    };

    return (
        <div className="service-explorer">
            <Link to="/" className="back-link">← Zurück zur Übersicht</Link>

            <header className="explorer-header">
                <h1>FastAPI Service Explorer</h1>
                <p className="service-url">Basis-URL: <code>{fastApiUrl}</code></p>
            </header>

            {/* 1. PUBLIC CHART TEST */}
            <section className="test-section">
                <h3>1. Hochperformante Bildgenerierung</h3>
                <p>FastAPI generiert ein Zufalls-Pie-Chart via Matplotlib (Asynchroner Endpunkt).</p>
                <button onClick={loadFastApiChart} className="btn-test">GET /api/public/chart</button>

                {chartUrl && (
                    <div className="chart-result-container">
                        <img src={chartUrl} alt="FastAPI Chart" className="test-chart" />
                    </div>
                )}
            </section>

            {/* 2. HIERARCHISCHE RBAC TESTS */}
            <section className="test-section">
                <h3>2. Hierarchische Level-Prüfung</h3>
                <p>Dependency Injection Validierung (User {'>'} Mod {'>'} Admin).</p>
                <div className="button-grid">
                    <button onClick={() => callFastApiAuth('/api/user/dashboard')} className="btn-test">User Dashboard</button>
                    <button onClick={() => callFastApiAuth('/api/moderator/system')} className="btn-test">Mod/Admin System</button>
                    <button onClick={() => callFastApiAuth('/api/admin/system')} className="btn-test">Admin Area</button>
                </div>
                {debugInfo && (
                    <pre className="debug-output">{JSON.stringify(debugInfo, null, 2)}</pre>
                )}
            </section>

            {/* 3. EXCLUSIVE ACCESS TEST */}
            <section className="test-section">
                <h3>3. Exakte Level-Prüfung (Exclusive)</h3>
                <p>Spezialfälle: Zugriff nur für genau eine Rolle.</p>
                <div className="button-grid">
                    <button onClick={() => callFastApiExclusiv('/api/exclusive/user/only')} className="btn-test">
                        Nur User (No Admins!)
                    </button>
                    <button onClick={() => callFastApiExclusiv('/api/exclusive/moderator/tools')} className="btn-test">
                        Nur Moderator
                    </button>
                </div>
                {debugInfoExclusiv && (
                    <pre className="debug-output">{JSON.stringify(debugInfoExclusiv, null, 2)}</pre>
                )}
            </section>
        </div>
    );
};
