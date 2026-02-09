require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const { format } = require('date-fns');
const { de } = require('date-fns/locale');


// 1. ZUERST DIE DATENBANK
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

// 2. ABSOLUTE PRIORITÄT FÜR API (Ganz oben!)
// Wir nutzen .use statt .get für /api, damit alles darunter "gefangen" wird
const api = express.Router();

api.get('/db-test', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT VERSION() as v');
        res.json({ status: "success", mysql: rows[0].v });
    } catch (e) { res.json({ error: e.message }); }
});

api.get('/test-env', (req, res) => {
    res.json({ secret: process.env.GEHEIMNIS });
});

api.get('/server-time', (req, res) => {
    const now = new Date();
    const formattedDate = format(now, "EEEE, do MMMM yyyy, HH:mm:ss 'Uhr'", { locale: de });
    res.json({ time: formattedDate });
});

api.get('/', (req, res) => {
    res.json({ info: "API Root funktioniert" });
});

// Hier binden wir den Router ein
app.use('/api', api);

// 3. STATISCHE DATEIEN (Frontend)
app.use(express.static(path.join(__dirname, 'public')));

// 4. DER SPA-RETTUNGSANKER (Nur für GET Anfragen)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port);

