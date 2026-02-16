export const validate = {
    // Interne Hilfsfunktion:
    _checkExists: (key: string, value: string | undefined) => {
        if (value === undefined || value.trim().length === 0) {
            throw new Error(`❌ Konfigurationsfehler: Variable "${key}" fehlt in der .env oder ist leer.`);
        }
    },

    string: (key: string, value: string | undefined): string => {
        validate._checkExists(key, value);
        return value!;
    },

    number: (key: string, value: string | undefined): number => {
        validate._checkExists(key, value);
        const parsed = parseInt(value!, 10);
        if (isNaN(parsed)) {
            throw new Error(`❌ Konfigurationsfehler: "${key}" muss eine Zahl sein (ist: "${value}")`);
        }
        return parsed;
    },

    email: (key: string, value: string | undefined): string => {
        validate._checkExists(key, value);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value!)) {
            throw new Error(`❌ Konfigurationsfehler: "${key}" ist keine gültige E-Mail Adresse.`);
        }
        return value!;
    },

    choice: (key: string, value: string | undefined, allowed: string[]): string => {
        validate._checkExists(key, value);
        if (!allowed.includes(value!)) {
            throw new Error(`❌ Konfigurationsfehler: "${key}" muss einer dieser Werte sein: ${allowed.join(', ')} (ist: "${value}")`);
        }
        return value!;
    },

    optionalString: (key: string, value: string | undefined): string | null => {
        if (value === undefined || value.trim().length === 0) {
            console.log(`ℹ️ Info: Optionale Variable "${key}" ist nicht gesetzt.`);
            return null;
        }
        return value;
    },
    array: (key: string, value: string | undefined): string[] => {
        validate._checkExists(key, value);
        // Splittet bei Komma und entfernt überflüssige Leerzeichen pro Eintrag
        const parts = value!.split(',').map(s => s.trim()).filter(s => s.length > 0);

        if (parts.length === 0) {
            throw new Error(`❌ Konfigurationsfehler: "${key}" muss mindestens einen Wert enthalten (kommagetrennt).`);
        }
        return parts;
    },

};