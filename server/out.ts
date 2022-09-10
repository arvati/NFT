import servestatic from '@fastify/static';
import path from 'path';

export const route = async (fastify, options) =>  {
fastify.register(servestatic, {
    root: path.join(__dirname, 'out'),
    prefix: '/'
    })
};