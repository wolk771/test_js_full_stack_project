/**
 * Struktur der Service-URLs, die vom Node-Backend 
 * für die Python-Integration bereitgestellt werden.
 */
export interface IntegrationConfig {
    services: {
        flask: string;
        fastAPI: string;
    };
    apiVersion: string;
}
