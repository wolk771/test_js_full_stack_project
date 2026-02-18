export class TimeUtils {
    /**
     * Wandelt Zeit-Strings (z.B. '8h', '30m') universell in Millisekunden um.
     * @param duration - Der String aus der .env
     */
    public static convertToMs(duration: string): number {
        const unit = duration.slice(-1);
        const value = parseInt(duration.slice(0, -1), 10);

        const unitMap: { [key: string]: number } = {
            's': 1000,
            'm': 60 * 1000,
            'h': 60 * 60 * 1000,
            'd': 24 * 60 * 60 * 1000
        };

        const factor = unitMap[unit];
        if (!factor) {
            throw new Error(`❌ TimeUtils: Unbekannte Zeiteinheit '${unit}'`);
        }

        return value * factor;
    }
}
