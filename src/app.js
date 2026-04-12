// import dotenv from 'dotenv';
// dotenv.config();
// import runMigrations from './db/migration.manager.js';

// async function server () {
//     try {
//         console.log('server is working');

//         await runMigrations();
//     } catch (err) {
//         console.error('[Error]', err.message);
//         process.exit(1);
//     }
// }

// server();

import Fastify from 'fastify';
// import cors from 'fastify/cors'
import dotenv from 'dotenv';

import routes from './routes/router.js';
dotenv.config();

const PORT = process.env.PORT;

const fastify = Fastify({
    logger: true,
});


const port = {
    port: PORT,
    host: '0.0.0.0',
}

fastify.register( routes, {
    prefix: '/api'
});

fastify.listen(port, (err, adress) => {
    if (err) {
        fastify.log.fatal(err);
        process.exit(1);
    }
})