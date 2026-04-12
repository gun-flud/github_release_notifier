import dotenv from 'dotenv';
dotenv.config();
import runMigrations from './db/migration.manager.js';

async function server () {
    try {
        console.log('server is working');

        await runMigrations();
    } catch (err) {
        console.error('[Error]', err.message);
        process.exit(1);
    }
}

server();