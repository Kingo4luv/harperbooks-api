const client = require('../../../config/dbconfig');

const bookOptions = {
    schema:{
        body:{
            type: 'object',
            required: ['title', 'price', 'publisher', 'author'],
            properties:{
                title:{type:'string'},
                price:{type: 'number'},
                publisher:{type: 'string'},
                author:{type: 'string'},
            }
        },
        response: {
            201: {
                type: 'object',
                properties: {
                    title:{type:'string'},
                    author:{type: 'string'},
                }
            }
        }
    }
}

/**
 * 
 * @param {import('fastify').FastifyInstance} fastify 
 */

module.exports = async function (fastify, opts) {
    fastify.get('/', async function (request, reply) {
        const querySelect = "select * from tutorials.books";
        try {
            const res = await client.query(querySelect)
            reply.status(200).send(res.data);
        } catch (err) {
            console.log(err);
        }
    });

    fastify.post('/', bookOptions, async (request, reply) => {
        
        try {
            const res = await client.insert({
                table: 'books',
                records: [request.body]
            })
            reply.code(201).send(res.data);
        } catch (err) {
            console.log(err);
        }
    });

    fastify.get('/:id', async function (request, reply) {
        const options = {
            table: 'books',
            hashValues: [request.params.id],
            attributes: ['*'],
        }
        try {
            const res = await client.searchByHash(options)
            reply.code(200).send(res.data);
        } catch (err) {
            console.log(err)
            return fastify.httpErrors.internalServerError("Something went wrong")
        }
    });

    fastify.patch('/', async function (request, reply) {
        const options = {
            // schema is not passed here since it has been passed while creating client
            table: 'books',
            records: [request.body]
        };
        try {
            const res = await client.update(options)
            reply.code(201).send(res.data);
        } catch (err) {
            console.log(err)
            return fastify.httpErrors.internalServerError("Something went wrong")
        }
    });
    fastify.delete('/:id', async function (request, reply) {
        const options = {
            // schema is not passed here since it has been passed while creating client
            table: 'books',
            hashValues: [request.params.id]
        };
        try {
            const res = await client.delete(options)
            reply.code(200).send(res.data);
        } catch (err) {
            console.log(err)
            return fastify.httpErrors.internalServerError("Something went wrong")
        }
    });

    fastify.post('/search', async function (request, reply) {
        const options = {
            table: 'books',
            searchAttribute: "title",
            searchValue: request.body.query,
            attributes: ['*'],
        };
        try {
            const res = await client.searchByValue(options)
            reply.code(200).send(res.data);
        } catch (err) {
            console.log(err)
            return fastify.httpErrors.internalServerError("Something went wrong")
        }
    });

}

