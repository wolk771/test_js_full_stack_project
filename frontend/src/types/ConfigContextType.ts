import { IntegrationConfig } from './IntegrationConfig';

/**
 * Interface für den globalen Konfigurations-Kontext.
 * Stellt die dynamischen Service-URLs für die gesamte App bereit.
 */
export interface ConfigContextType {
    config: IntegrationConfig | null;
    isLoading: boolean;
    error: string | null; // Falls das Backend nicht antwortet
}
