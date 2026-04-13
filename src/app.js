import Fastify from "fastify";
import dotenv from "dotenv";
dotenv.config();

import routes from "./routes/router.js";
import runMigrations from './db/migration.manager.js';

const PORT = parseInt(process.env.PORT || "3000");

const fastify = Fastify({
    logger: true,
});

const port = {
    port: PORT,
    host: "0.0.0.0",
};
 
    fastify.register(routes, { prefix: "/api", });

try {
    await runMigrations();
    await fastify.listen(port);
} catch (err) {
    fastify.log.fatal(err);
    process.exit(1);
}
