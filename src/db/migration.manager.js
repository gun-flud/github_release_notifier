import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readdirSync, readFileSync } from 'node:fs';

import { pool } from './pool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.join(__dirname, 'migrations');

async function runMigrations() {
    const files = readdirSync(migrationsDir)
    .filter(el => el.endsWith('.sql'))
    .sort();



    const client = await pool.connect();

    try {

        await client.query(`
            CREATE TABLE IF NOT EXISTS migrations (
            id       SERIAL PRIMARY KEY,
            filename VARCHAR(255) UNIQUE NOT NULL,
            run_at   TIMESTAMP DEFAULT NOW())
        `);

        for (const file of files) {
            const { rows } = await client.query(`
            SELECT id FROM migrations WHERE filename = $1`,
            [file]);

            if (rows.length > 0) {
                console.log('migration skipping for', file);
                continue;
            }

            console.log('migrations running', file);
            const sql = readFileSync(path.join(migrationsDir, file), 'utf-8');

            await client.query('BEGIN');
            await client.query(sql);
            await client.query(
                'INSERT INTO migrations (filename) VALUES ($1)',
                [file]
            );

            await client.query('COMMIT')
        }
        

    } catch (err) {
        await client.query('ROLLBACK')
        console.error('failed to migrate', err.message);
        throw err;
    } finally {
        client.release()
        console.log('migrations completed');
    }
}

export default runMigrations;