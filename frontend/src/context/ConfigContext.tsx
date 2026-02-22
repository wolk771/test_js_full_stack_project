import React, { createContext, useContext, useState, useEffect } from 'react';
import { configService } from '../api/configService';
import { IntegrationConfig } from '../types/IntegrationConfig';
import { ConfigContextType } from '../types/ConfigContextType';

// Wir nutzen das spezifische Interface aus dem types-Ordner
const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<IntegrationConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const result = await configService.getSetup();
                
                if (result.status === 'success' && result.data) {
                    setConfig(result.data);
                    setError(null);
                } else {
                    setError(result.message || 'Fehler beim Laden des Integrations-Setups');
                }
            } catch (err) {
                setError('Verbindung zum Konfigurations-Server fehlgeschlagen');
            } finally {
                setIsLoading(false);
            }
        };

        loadConfig();
    }, []);

    return (
        <ConfigContext.Provider value={{ config, isLoading, error }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error('useConfig muss innerhalb eines ConfigProviders verwendet werden');
    }
    return context;
};
