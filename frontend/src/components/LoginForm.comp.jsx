import { useState } from 'react';
import { AuthService } from '../services/AuthService';

export default function LoginForm({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await AuthService.login(email, password);
        if (result.success) {
            onLoginSuccess();
        } else {
            setError(result.message);
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
            <h3>Login Bereich</h3>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="E-Mail" value={email} onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Passwort" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit">Anmelden</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}
