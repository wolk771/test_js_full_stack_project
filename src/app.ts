import { ENV } from './config/env';
import express, { Request, Response, Router, NextFunction } from 'express'; // NextFunction hinzugefügt
import path from 'path';
import knex from 'knex';
import cors from 'cors';
const knexConfig = require('../knexfile');

import { AuthService } from './services/AuthService';
import { SystemController } from './controllers/SystemController';
import { DatabaseController } from './controllers/DatabaseController';
import { AuthController } from './controllers/AuthController';
import { UserController } from './controllers/UserController';
import { protect, restrictToLevel } from './middleware/authMiddleware';
import { AuthRequest } from './interfaces/AuthRequest';
import helmet from 'helmet';

const app = express();

// 2. CORS KONFIGURATION
app.use(cors({
    origin: ENV.ALLOWED_ORIGINS,
    credentials: true // Erlaubt das Senden von Cookies/Auth-Headern
}));


// 3. HELMET ANPASSUNG (Damit Vite-Inlines nicht blockiert werden)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'"],
            "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Erlaubt Vite Scripte
            "style-src": ["'self'", "'unsafe-inline'"],
            "img-src": ["'self'", "data:", "blob:"],
            "connect-src": ["'self'"] // Wichtig für deine API-Calls
        },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 4. GLOBALE MIDDLEWARE
app.use(express.json());

// JSON-Syntax-Fehler abfangen (verhindert Server-Absturz bei Fehlern vom Client)
app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({ status: 'error', message: 'Ungültiges JSON-Format' });
    }
    next();
});

const port: number = ENV.PORT;

// 5. KNEX INITIALISIERUNG
const db = knex(knexConfig[ENV.NODE_ENV]);

// 6. API-ROUTING
const api: Router = Router();

// Auth & Status Check
api.get('/check-auth', protect, (req: AuthRequest, res: Response) => SystemController.checkAuth(req, res));

// Auth
api.post('/login', (req, res) => AuthController.login(db, req, res));

// Geschützte Routen
api.get('/user-stats', protect, (req: AuthRequest, res: Response) => SystemController.getUserStats(db, req, res));

// Benutzerverwaltung (Mindestens Moderator-Level erforderlich)
api.get('/users', protect, restrictToLevel(50), (req: AuthRequest, res: Response) => 
    UserController.getAllUsers(db, req, res)
);

api.get('/user-area', protect, (req: AuthRequest, res: Response) => {
    res.json({ status: 'success', message: `Hallo ${req.user?.nickname}, willkommen im User-Bereich.` });
});

api.get('/moderator-area', protect, restrictToLevel(50), (req: AuthRequest, res: Response) => {
    res.json({ status: 'success', message: `Status: Moderator. Willkommen zurück, ${req.user?.nickname}!` });
});

api.get('/admin-area', protect, restrictToLevel(100), (req: AuthRequest, res: Response) => {
    res.json({ status: 'success', message: `Kritischer Zugriff gewährt. Administrator: ${req.user?.nickname}.` });
});

// System & Test
api.get('/db-test', (req, res) => DatabaseController.testConnection(db, req, res));
api.get('/server-time', SystemController.getServerTime);
api.get('/test-env', SystemController.testEnv); // Nutzt jetzt die Logik im Controller
api.get('/', SystemController.getStatus);

app.use('/api', api);

// 4. STATISCHE DATEIEN (Plesk-Simulation)
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// 5. START-SEQUENZ
db.migrate.latest()
    .then(async () => {
        try {
            await AuthService.ensureAdminIntegrity(db);
            console.log('✅ System-Integrität (Admin-Check) geprüft.');
        } catch (authError) {
            console.error('❌ Fehler beim Integritäts-Check:', authError);
            process.exit(1);
        }

        console.log(`🚀 Datenbank-Schema im Modus "${ENV.NODE_ENV}" ist aktuell.`);

        app.listen(port, () => {
            console.log(`🌍 Server läuft auf http://localhost:${port} im ${ENV.NODE_ENV}-Modus`);
        });
    })
    .catch((err) => {
        console.error('❌ Kritischer Fehler bei der Migration oder System-Start:', err);
        process.exit(1);
    });
