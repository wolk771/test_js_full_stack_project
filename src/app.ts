import dotenv from 'dotenv';
import express, { Request, Response, Router } from 'express';
import path from 'path';
import knex from 'knex';
// Configuration von knexfile.js anstatt ts nur mit require
const knexConfig = require('../knexfile');
// import knexConfig from '../knexfile'; // mit .ts 
import { AuthService } from './services/AuthService';

import { SystemController } from './controllers/SystemController';
import { DatabaseController } from './controllers/DatabaseController';

// auth
import { AuthController } from './controllers/AuthController';
import { protect } from './middleware/authMiddleware';
import helmet from 'helmet';


dotenv.config();

const app = express();
app.use(helmet());
const port: number = Number(process.env.PORT) || 3000;

// 1. KNEX INITIALISIERUNG
const environment = process.env.NODE_ENV || 'development';
const db = knex(knexConfig[environment]);


// 2. API-ROUTING (Definition)
const api: Router = Router();

// 1. Login ist öffentlich
api.post('/login', express.json(), (req, res) => AuthController.login(db, req, res));

// 2. User-Stats ist jetzt GESCHÜTZT (nur mit Token erreichbar)
api.get('/user-stats', protect, (req, res) => SystemController.getUserStats(db, req, res));

api.get('/db-test', (req, res) => DatabaseController.testConnection(db, req, res));
api.get('/server-time', SystemController.getServerTime);
api.get('/test-env', SystemController.testEnv);
api.get('/', SystemController.getStatus);



app.use('/api', api);

// 3. STATISCHE DATEIEN
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// 4. START-SEQUENZ
db.migrate.latest()
    .then(async () => { //

        try {
            // Integritäts-Check via Service
            await AuthService.ensureAdminIntegrity(db);
            console.log('✅ System-Integrität (Admin-Check) geprüft.');
        } catch (authError) {
            console.error('❌ Fehler beim Integritäts-Check:', authError);
            // App wird nicht gestartet, wenn der Admin fehlt.
            process.exit(1);
        }

        console.log('🚀 Datenbank-Schema im Container ist aktuell.');

        app.listen(port, () => {
            console.log(`🌍 Server läuft auf http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('❌ Kritischer Fehler bei der Migration oder System-Start:', err);
        process.exit(1);
    });
