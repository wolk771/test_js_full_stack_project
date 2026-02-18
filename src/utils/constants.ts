/**
 * Zentrale Sammlung von Validierungsmustern.
 * Ermöglicht einfache Erweiterung (z.B. um Sekunden 's' oder Tage 'd').
 */
export const TIME_REGEX = {
    HOURS_MINUTES: /^\d+[hm]$/,
    HOURS_MINUTES_SECONDS: /^\d+[hms]$/,
    FULL_TIME: /^\d+[hmsd]$/ // h=Stunden, m=Minuten, s=Sekunden, d=Tage
};
