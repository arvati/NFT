"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = void 0;
const route = async (fastify, options) => {
    fastify.get('/api/hello', async (request, reply) => {
        return { name: 'John Doe' };
    });
};
exports.route = route;
