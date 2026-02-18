"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoUtils = void 0;
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("../config/env");
class CryptoUtils {
    static hashToken(token) {
        return crypto_1.default
            .createHash(env_1.ENV.AUTH_HASH_ALGO)
            .update(token)
            .digest(env_1.ENV.AUTH_HASH_ENCODING);
    }
}
exports.CryptoUtils = CryptoUtils;
