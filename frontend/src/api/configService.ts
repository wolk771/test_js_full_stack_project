import { apiRequest } from './apiClient';
import { ApiResponse } from '../types/ApiResponse';
import { IntegrationConfig } from '../types/IntegrationConfig';

export const configService = {
    /**
     * Holt das Integrations-Setup vom Node-Backend.
     * Nutzt das globale ApiResponse Interface mit dem T-Parameter IntegrationConfig.
     */
    getSetup: async (): Promise<ApiResponse<IntegrationConfig>> => {
        return await apiRequest<IntegrationConfig>('/api/integration/setup');
    }
};
