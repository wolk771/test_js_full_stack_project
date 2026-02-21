"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerDocument = __importStar(require("./swagger.json"));
const env_1 = require("./config/env");
const options = {
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
const setupSwagger = (app) => {
    const dynamicSwaggerDoc = { ...swaggerDocument };
    dynamicSwaggerDoc.servers = [
        {
            url: "{protocol}://" + env_1.ENV.SERVER_HOST + "/api",
            description: "API Server Auswahl",
            variables: {
                protocol: {
                    enum: ["http", "https"],
                    default: env_1.ENV.NODE_ENV === 'production' ? "https" : "http"
                }
            }
        }
    ];
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(dynamicSwaggerDoc, options));
    console.log(`✅ Swagger-UI bereit unter /api-docs (Host: ${env_1.ENV.SERVER_HOST})`);
};
exports.setupSwagger = setupSwagger;
