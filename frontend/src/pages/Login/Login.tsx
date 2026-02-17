import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../api/apiClient';
import './Login.css';

/**
 * Komponente für die Benutzeranmeldung.
 * Verarbeitet die Zugangsdaten, interagiert mit der Login-API und 
 * initiiert die Identitätsverifizierung im globalen AuthContext.
 */
export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    /**
     * Verarbeitet das Absenden des Login-Formulars.
     * Nutzt den apiRequest-Wrapper für den POST-Call und delegiert 
     * die Token-Validierung an den AuthContext.
     * 
     * @param e - Das synthetische Formular-Event
     */
    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            // Ausführung des Authentifizierungs-Requests gegen den Backend-Endpunkt
            const result = await apiRequest<{ token: string }>('/api/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            if (result.status === 'success' && result.data?.token) {
                // Delegation der Token-Verifizierung an den AuthContext (Single Source of Truth)
                await login(result.data.token);

                console.log("✅ Authentifizierung erfolgreich durch Server bestätigt.");
                navigate('/dashboard');
            } else {
                setError(result.message || 'Anmeldung fehlgeschlagen.');
            }
        } catch (err) {
            console.error("Login-Fehler:", err);
            setError('Verbindung zum Server fehlgeschlagen.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Anmelden</h2>

                {error && (
                    <div className="error-msg" role="alert">
                        {error}
                    </div>
                )}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">E-Mail Adresse</label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="beispiel@domain.de"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Passwort</label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Wird angemeldet...' : 'Anmelden'}
                    </button>
                </form>
            </div>
        </div>
    );
};
