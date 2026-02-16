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
const env_1 = require("./config/env");
const express_1 = __importStar(require("express"));
const path_1 = __importDefault(require("path"));
const knex_1 = __importDefault(require("knex"));
const cors_1 = __importDefault(require("cors"));
const knexConfig = require('../knexfile');
const AuthService_1 = require("./services/AuthService");
const SystemController_1 = require("./controllers/SystemController");
const DatabaseController_1 = require("./controllers/DatabaseController");
const AuthController_1 = require("./controllers/AuthController");
const authMiddleware_1 = require("./middleware/authMiddleware");
const helmet_1 = __importDefault(require("helmet"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: env_1.ENV.ALLOWED_ORIGINS,
    credentials: true
}));
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'"],
            "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            "style-src": ["'self'", "'unsafe-inline'"],
            "img-src": ["'self'", "data:", "blob:"],
            "connect-src": ["'self'"]
        },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express_1.default.json());
app.use((err, _req, res, next) => {
    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({ status: 'error', message: 'Ungültiges JSON-Format' });
    }
    next();
});
const port = env_1.ENV.PORT;
const db = (0, knex_1.default)(knexConfig[env_1.ENV.NODE_ENV]);
const api = (0, express_1.Router)();
api.get('/check-auth', authMiddleware_1.protect, (req, res) => SystemController_1.SystemController.checkAuth(req, res));
api.post('/login', (req, res) => AuthController_1.AuthController.login(db, req, res));
api.get('/user-stats', authMiddleware_1.protect, (req, res) => SystemController_1.SystemController.getUserStats(db, req, res));
api.get('/user-area', authMiddleware_1.protect, (req, res) => {
    res.json({ status: 'success', message: `Hallo ${req.user?.nickname}, willkommen im User-Bereich.` });
});
api.get('/moderator-area', authMiddleware_1.protect, (0, authMiddleware_1.restrictToLevel)(50), (req, res) => {
    res.json({ status: 'success', message: `Status: Moderator. Willkommen zurück, ${req.user?.nickname}!` });
});
api.get('/admin-area', authMiddleware_1.protect, (0, authMiddleware_1.restrictToLevel)(100), (req, res) => {
    res.json({ status: 'success', message: `Kritischer Zugriff gewährt. Administrator: ${req.user?.nickname}.` });
});
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
    console.log(`🚀 Datenbank-Schema im Modus "${env_1.ENV.NODE_ENV}" ist aktuell.`);
    app.listen(port, () => {
        console.log(`🌍 Server läuft auf http://localhost:${port} im ${env_1.ENV.NODE_ENV}-Modus`);
    });
})
    .catch((err) => {
    console.error('❌ Kritischer Fehler bei der Migration oder System-Start:', err);
    process.exit(1);
});
