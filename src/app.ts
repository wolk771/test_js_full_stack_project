import dotenv from 'dotenv';
import express, { Request, Response, Router } from 'express';
import path from 'path';
import knex from 'knex';
// Configuration von knexfile.js anstatt ts nur mit require
const knexConfig = require('../knexfile'); 
// import knexConfig from '../knexfile'; // mit .ts 

import { SystemController } from './controllers/SystemController';
import { DatabaseController } from './controllers/DatabaseController';

dotenv.config();

const app = express();
const port: number = Number(process.env.PORT) || 3000;

// 1. KNEX INITIALISIERUNG
const environment = process.env.NODE_ENV || 'development';
const db = knex(knexConfig[environment]);

// 2. API-ROUTING (Definition)
const api: Router = Router();
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
    .then(() => {
        console.log('🚀 Datenbank-Schema im Container ist aktuell.');
        app.listen(port, () => {
            console.log(`🌍 Server läuft auf http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('❌ Fehler bei der Migration:', err);
        process.exit(1); 
    });
