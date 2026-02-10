import dotenv from 'dotenv';
import express, { Request, Response, Router } from 'express';
import mysql from 'mysql2/promise';
import path from 'path';

import { SystemController } from './controllers/SystemController';
import { DatabaseController } from './controllers/DatabaseController';

dotenv.config();

const app = express();
const port: number = Number(process.env.PORT) || 3000;

// 1. DATENBANK POOL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306
});

const api: Router = Router();

// 2. API-ROUTING (Alle Logik ist jetzt in Controllern)
api.get('/db-test', (req, res) => DatabaseController.testConnection(pool, req, res));
api.get('/server-time', SystemController.getServerTime);
api.get('/test-env', SystemController.testEnv); // Jetzt sauber im SystemController
api.get('/', SystemController.getStatus);

app.use('/api', api);

// 3. STATISCHE DATEIEN & SPA-ROUTING
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
