"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
exports.validate = {
    _checkExists: (key, value) => {
        if (value === undefined || value.trim().length === 0) {
            throw new Error(`❌ Konfigurationsfehler: Variable "${key}" fehlt in der .env oder ist leer.`);
        }
    },
    string: (key, value) => {
        exports.validate._checkExists(key, value);
        return value;
    },
    number: (key, value) => {
        exports.validate._checkExists(key, value);
        const parsed = parseInt(value, 10);
        if (isNaN(parsed)) {
            throw new Error(`❌ Konfigurationsfehler: "${key}" muss eine Zahl sein (ist: "${value}")`);
        }
        return parsed;
    },
    email: (key, value) => {
        exports.validate._checkExists(key, value);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            throw new Error(`❌ Konfigurationsfehler: "${key}" ist keine gültige E-Mail Adresse.`);
        }
        return value;
    },
    choice: (key, value, allowed) => {
        exports.validate._checkExists(key, value);
        if (!allowed.includes(value)) {
            throw new Error(`❌ Konfigurationsfehler: "${key}" muss einer dieser Werte sein: ${allowed.join(', ')} (ist: "${value}")`);
        }
        return value;
    },
    optionalString: (key, value) => {
        if (value === undefined || value.trim().length === 0) {
            console.log(`ℹ️ Info: Optionale Variable "${key}" ist nicht gesetzt.`);
            return null;
        }
        return value;
    },
    array: (key, value) => {
        exports.validate._checkExists(key, value);
        const parts = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
        if (parts.length === 0) {
            throw new Error(`❌ Konfigurationsfehler: "${key}" muss mindestens einen Wert enthalten (kommagetrennt).`);
        }
        return parts;
    },
};
