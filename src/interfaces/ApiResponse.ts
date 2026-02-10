/**
 * Standard-Struktur für alle API-Antworten.
 * Felder mit '?' sind optional und erscheinen nur im JSON, wenn sie gesetzt sind.
 */
export interface ApiResponse {
    status: 'success' | 'error';
    message: string;         // Eine kurze Nachricht, was passiert ist
    data?: any;              // Hier kommen später User, Listen etc. rein
    errorDetails?: string;   // Nur im Fehlerfall für das Debugging
}
