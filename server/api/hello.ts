export const route = async (fastify, options) =>  {
    fastify.get('/api/hello', async (request, reply) => {
      return { name: 'John Doe' }
    })
};
  


