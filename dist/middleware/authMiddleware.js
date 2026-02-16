"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictToLevel = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const response = {
            status: 'error',
            message: 'Nicht autorisiert: Kein gültiges Token vorhanden'
        };
        return res.status(401).json(response);
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.ENV.GEHEIMNIS);
        if (!decoded ||
            !decoded.userId ||
            !decoded.email ||
            !decoded.nickname ||
            !decoded.role ||
            decoded.level === undefined) {
            throw new Error('Token-Inhalt unvollständig');
        }
        req.user = {
            userId: Number(decoded.userId),
            email: String(decoded.email),
            nickname: String(decoded.nickname),
            role: String(decoded.role),
            level: Number(decoded.level)
        };
        next();
    }
    catch (err) {
        const response = {
            status: 'error',
            message: 'Ungültiges oder abgelaufenes Token'
        };
        return res.status(401).json(response);
    }
};
exports.protect = protect;
const restrictToLevel = (minLevel) => {
    return (req, res, next) => {
        if (!req.user || req.user.level < minLevel) {
            const response = {
                status: 'error',
                message: 'Zugriff verweigert: Unzureichende Berechtigungen'
            };
            return res.status(403).json(response);
        }
        next();
    };
};
exports.restrictToLevel = restrictToLevel;
