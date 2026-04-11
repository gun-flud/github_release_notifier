import { Pool } from 'pg'; 
import dotenv from 'dotenv';
dotenv.config();

export const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,

    max: 20,
    idleTimeoutMillis: 20000,
    connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
    console.log('DB is connected to postgresql');
});

pool.on('error', (err) => {
    console.error("Postgres pool's client error", err.message);
});