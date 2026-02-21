"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_zod_api_1 = require("express-zod-api");
const docs_1 = require("./docs");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const spec = new express_zod_api_1.Documentation({
    routing: docs_1.routing,
    config: {
        cors: true,
        logger: { level: "silent" }
    },
    version: "1.0.0",
    title: "Meine API Dokumentation",
    serverUrl: "http://localhost:8090",
}).getSpec();
const outputPath = path_1.default.join(__dirname, "swagger.json");
(0, fs_1.writeFileSync)(outputPath, JSON.stringify(spec, null, 2), "utf-8");
console.log(`✅ Erfolg! Die Datei wurde erstellt unter: ${outputPath}`);
