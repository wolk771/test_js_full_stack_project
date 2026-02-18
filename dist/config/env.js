"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const envValidator_1 = require("../utils/envValidator");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const timeUtils_1 = require("../utils/timeUtils");
const tokenExpiresIn = envValidator_1.validate.validateHoursMinutes('AUTH_TOKEN_EXPIRES_IN', process.env.AUTH_TOKEN_EXPIRES_IN);
exports.ENV = {
    NODE_ENV: envValidator_1.validate.choice('NODE_ENV', process.env.NODE_ENV, ['development', 'production']),
    PORT: envValidator_1.validate.number('PORT', process.env.PORT),
    GEHEIMNIS: envValidator_1.validate.string('GEHEIMNIS', process.env.GEHEIMNIS),
    DB_HOST: envValidator_1.validate.string('DB_HOST', process.env.DB_HOST),
    DB_PORT: envValidator_1.validate.number('DB_PORT', process.env.DB_PORT),
    DB_NAME: envValidator_1.validate.string('DB_NAME', process.env.DB_NAME),
    DB_USER: envValidator_1.validate.string('DB_USER', process.env.DB_USER),
    DB_PASS: envValidator_1.validate.string('DB_PASS', process.env.DB_PASS),
    DB_ROOT_PASSWORD: envValidator_1.validate.optionalString('DB_ROOT_PASSWORD', process.env.DB_ROOT_PASSWORD),
    INIT_ADMIN_NICK: envValidator_1.validate.string('INIT_ADMIN_NICK', process.env.INIT_ADMIN_NICK),
    INIT_ADMIN_EMAIL: envValidator_1.validate.email('INIT_ADMIN_EMAIL', process.env.INIT_ADMIN_EMAIL),
    INIT_ADMIN_PASS: envValidator_1.validate.string('INIT_ADMIN_PASS', process.env.INIT_ADMIN_PASS),
    INIT_USER_NICK: envValidator_1.validate.string('INIT_USER_NICK', process.env.INIT_USER_NICK),
    INIT_USER_EMAIL: envValidator_1.validate.email('INIT_USER_EMAIL', process.env.INIT_USER_EMAIL),
    INIT_USER_PASS: envValidator_1.validate.string('INIT_USER_PASS', process.env.INIT_USER_PASS),
    INIT_MOD_NICK: envValidator_1.validate.string('INIT_MOD_NICK', process.env.INIT_MOD_NICK),
    INIT_MOD_EMAIL: envValidator_1.validate.email('INIT_MOD_EMAIL', process.env.INIT_MOD_EMAIL),
    INIT_MOD_PASS: envValidator_1.validate.string('INIT_MOD_PASS', process.env.INIT_MOD_PASS),
    BCRYPT_ROUNDS: envValidator_1.validate.number('BCRYPT_ROUNDS', process.env.BCRYPT_ROUNDS),
    ALLOWED_ORIGINS: envValidator_1.validate.array('ALLOWED_ORIGINS', process.env.ALLOWED_ORIGINS),
    AUTH_HASH_ALGO: envValidator_1.validate.choice('AUTH_HASH_ALGO', process.env.AUTH_HASH_ALGO, ['sha256', 'sha512']),
    AUTH_HASH_ENCODING: envValidator_1.validate.choice('AUTH_HASH_ENCODING', process.env.AUTH_HASH_ENCODING, ['hex', 'base64']),
    AUTH_TOKEN_EXPIRES_IN: tokenExpiresIn,
    AUTH_SESSION_TTL_MS: timeUtils_1.TimeUtils.convertToMs(tokenExpiresIn),
};
