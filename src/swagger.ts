import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
// Import als Modul
import * as swaggerDocument from './swagger.json';
import { ENV } from './config/env';

const options = {
  // CSS, das spezifisch die Status-Spalten für Fehler anspricht
  customCss: `
    .swagger-ui .response-400 .response-col_status,
    .swagger-ui .response-401 .response-col_status,
    .swagger-ui .response-404 .response-col_status,
    .swagger-ui .response-500 .response-col_status {
      color: #ff0000 !important;
      font-weight: bold;
    }
    /* Optional: Ganzer Block-Rahmen für Error-Responses */
    .swagger-ui .response-400, .swagger-ui .response-500 {
      background-color: rgba(255, 0, 0, 0.05);
 
   }
  `
};

export const setupSwagger = (app: Express) => {

   const dynamicSwaggerDoc = { ...swaggerDocument };

    (dynamicSwaggerDoc as any).servers = [
    {
      url: "{protocol}://" + ENV.SERVER_HOST + "/api",
      description: "API Server Auswahl",
      variables: {
        protocol: {
          enum: ["http", "https"],
          default: ENV.NODE_ENV === 'production' ? "https" : "http"
        }
      }
    }
  ];

 app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(dynamicSwaggerDoc, options));
  console.log(`✅ Swagger-UI bereit unter /api-docs (Host: ${ENV.SERVER_HOST})`);
};