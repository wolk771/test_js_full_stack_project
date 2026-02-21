import { validate } from '../utils/envValidator';
import dotenv from 'dotenv';
dotenv.config();
import { TimeUtils } from '../utils/timeUtils';

const tokenExpiresIn = validate.validateHoursMinutes('AUTH_TOKEN_EXPIRES_IN', process.env.AUTH_TOKEN_EXPIRES_IN);

// Alle neu benötigte Variablen aus der env-Datei hier einzutragen!
export const ENV = {
    // Server & Mode
    NODE_ENV: validate.choice('NODE_ENV', process.env.NODE_ENV, ['development', 'production']),
    PORT: validate.number('PORT', process.env.PORT),
    GEHEIMNIS: validate.string('GEHEIMNIS', process.env.GEHEIMNIS),

    // Datenbank
    DB_HOST: validate.string('DB_HOST', process.env.DB_HOST),
    DB_PORT: validate.number('DB_PORT', process.env.DB_PORT),
    DB_NAME: validate.string('DB_NAME', process.env.DB_NAME),
    DB_USER: validate.string('DB_USER', process.env.DB_USER),
    DB_PASS: validate.string('DB_PASS', process.env.DB_PASS),

    // SONDERFALL: Nur für Podman (Lokal) wichtig
    DB_ROOT_PASSWORD: validate.optionalString('DB_ROOT_PASSWORD', process.env.DB_ROOT_PASSWORD),

    // Users
    INIT_ADMIN_NICK: validate.string('INIT_ADMIN_NICK', process.env.INIT_ADMIN_NICK),
    INIT_ADMIN_EMAIL: validate.email('INIT_ADMIN_EMAIL', process.env.INIT_ADMIN_EMAIL),
    INIT_ADMIN_PASS: validate.string('INIT_ADMIN_PASS', process.env.INIT_ADMIN_PASS),

    INIT_USER_NICK: validate.string('INIT_USER_NICK', process.env.INIT_USER_NICK),
    INIT_USER_EMAIL: validate.email('INIT_USER_EMAIL', process.env.INIT_USER_EMAIL),
    INIT_USER_PASS: validate.string('INIT_USER_PASS', process.env.INIT_USER_PASS),

    INIT_MOD_NICK: validate.string('INIT_MOD_NICK', process.env.INIT_MOD_NICK),
    INIT_MOD_EMAIL: validate.email('INIT_MOD_EMAIL', process.env.INIT_MOD_EMAIL),
    INIT_MOD_PASS: validate.string('INIT_MOD_PASS', process.env.INIT_MOD_PASS),

    BCRYPT_ROUNDS: validate.number('BCRYPT_ROUNDS', process.env.BCRYPT_ROUNDS),

    ALLOWED_ORIGINS: validate.array('ALLOWED_ORIGINS', process.env.ALLOWED_ORIGINS),

    AUTH_HASH_ALGO: validate.choice('AUTH_HASH_ALGO', process.env.AUTH_HASH_ALGO, ['sha256', 'sha512']),
    AUTH_HASH_ENCODING: validate.choice('AUTH_HASH_ENCODING', process.env.AUTH_HASH_ENCODING, ['hex', 'base64']),

    AUTH_TOKEN_EXPIRES_IN: tokenExpiresIn,
    AUTH_SESSION_TTL_MS: TimeUtils.convertToMs(tokenExpiresIn),

    SERVER_HOST: validate.string('SERVER_HOST', process.env.SERVER_HOST),
};
