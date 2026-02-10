import dotenv from 'dotenv';
import express, { Request, Response, Router } from 'express';
import mysql from 'mysql2/promise';
import path from 'path';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

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

// 2. API ENDPUNKTE
api.get('/db-test', async (_req: Request, res: Response) => {
    try {
        const [rows] = await pool.query('SELECT VERSION() as v') as any[];
        res.json({ status: "success", mysql: rows[0].v });
    } catch (e: any) { res.json({ error: e.message }); }
});

api.get('/test-env', (_req: Request, res: Response) => {
    res.json({ secret: process.env.GEHEIMNIS });
});

api.get('/server-time', (_req: Request, res: Response) => {
    const now = new Date();
    const formattedDate = format(now, "EEEE, do MMMM yyyy, HH:mm:ss 'Uhr'", { locale: de });
    res.json({ time: formattedDate });
});

api.get('/', (_req: Request, res: Response) => {
    res.json({ info: "API Root funktioniert" });
});

// Hier binden wir den Router ein
app.use('/api', api);

// 3. STATISCHE DATEIEN & SPA-ROUTING
// Wichtig: '..' um aus /src eine Ebene höher zu kommen
const publicPath = path.join(__dirname, '..', 'public');

app.use(express.static(publicPath));

app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});

