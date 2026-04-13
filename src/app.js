import Fastify from "fastify";
import dotenv from "dotenv";
dotenv.config();

import routes from "./routes/router.js";
import runMigrations from "./db/migration.manager.js";

const PORT = parseInt(process.env.PORT || "3000");

const fastify = Fastify({
    logger: true,
});

const port = {
    port: PORT,
    host: "0.0.0.0",
};

fastify.setErrorHandler((err, request, reply) => {
    const status = err.status || err.statusCode || 500;

    let message = err.message || "Internal server error";

    if (status >= 500) {
        request.log.error(`!!!Error in request: 
        METHOD: ${request.method}
        URL ${request.url}, 
        error: ${err}`);

        message = "unexpected Internal server error";
    } else {
        request.log.warn(`Users error:
        STATUS: ${status}
        MESSAGE ${message}`);
    }

    reply.code(status).send({
        status: status,
        message: message,
    });
});

fastify.register(routes, { prefix: "/api" });

try {
    await runMigrations();
    await fastify.listen(port);
} catch (err) {
    fastify.log.fatal(err);
    process.exit(1);
}
