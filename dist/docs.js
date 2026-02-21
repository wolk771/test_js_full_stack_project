"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routing = void 0;
const express_zod_api_1 = require("express-zod-api");
const zod_1 = require("zod");
const factory = new express_zod_api_1.EndpointsFactory(express_zod_api_1.defaultResultHandler);
const loginEndpoint = factory.build({
    method: "post",
    input: zod_1.z.object({
        email: zod_1.z.string(),
        password: zod_1.z.string()
    }),
    output: zod_1.z.object({
        status: zod_1.z.string(),
        token: zod_1.z.string().optional()
    }),
    handler: async () => ({ status: "success", token: "jwt-token" })
});
const checkAuthEndpoint = factory.build({
    method: "get",
    input: zod_1.z.object({}),
    output: zod_1.z.object({
        status: zod_1.z.string(),
        authenticated: zod_1.z.boolean()
    }),
    handler: async () => ({ status: "success", authenticated: true })
});
exports.routing = {
    api: {
        login: loginEndpoint,
        "check-auth": checkAuthEndpoint
    }
};
