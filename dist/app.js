"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importStar(require("express"));
const path_1 = __importDefault(require("path"));
const knex_1 = __importDefault(require("knex"));
const knexConfig = require('../knexfile');
const AuthService_1 = require("./services/AuthService");
const SystemController_1 = require("./controllers/SystemController");
const DatabaseController_1 = require("./controllers/DatabaseController");
const AuthController_1 = require("./controllers/AuthController");
const authMiddleware_1 = require("./middleware/authMiddleware");
const helmet_1 = __importDefault(require("helmet"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
const port = Number(process.env.PORT) || 3000;
const environment = process.env.NODE_ENV || 'development';
const db = (0, knex_1.default)(knexConfig[environment]);
const api = (0, express_1.Router)();
api.post('/login', express_1.default.json(), (req, res) => AuthController_1.AuthController.login(db, req, res));
api.get('/user-stats', authMiddleware_1.protect, (req, res) => SystemController_1.SystemController.getUserStats(db, req, res));
api.get('/db-test', (req, res) => DatabaseController_1.DatabaseController.testConnection(db, req, res));
api.get('/server-time', SystemController_1.SystemController.getServerTime);
api.get('/test-env', SystemController_1.SystemController.testEnv);
api.get('/', SystemController_1.SystemController.getStatus);
app.use('/api', api);
const publicPath = path_1.default.join(__dirname, '..', 'public');
app.use(express_1.default.static(publicPath));
app.get('*', (_req, res) => {
    res.sendFile(path_1.default.join(publicPath, 'index.html'));
});
db.migrate.latest()
    .then(async () => {
    try {
        await AuthService_1.AuthService.ensureAdminIntegrity(db);
        console.log('✅ System-Integrität (Admin-Check) geprüft.');
    }
    catch (authError) {
        console.error('❌ Fehler beim Integritäts-Check:', authError);
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
