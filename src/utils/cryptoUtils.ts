import crypto from 'crypto';
import { ENV } from '../config/env';

export class CryptoUtils {
    /**
     * Erzeugt einen Hash basierend auf den zentralen Umgebungsvariablen.
     */
    public static hashToken(token: string): string {
        return crypto
            .createHash(ENV.AUTH_HASH_ALGO)
            .update(token)
            .digest(ENV.AUTH_HASH_ENCODING as crypto.BinaryToTextEncoding);
    }
}
