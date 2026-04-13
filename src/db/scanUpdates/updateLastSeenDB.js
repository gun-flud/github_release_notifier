import { pool } from "../pool.js";

export default async function updateLastSeenDB(id, lastVersion) {
    try {
        await pool.query(`
        UPDATE repositories 
        SET last_seen = $1
        WHERE id = $2
        `, [lastVersion, id]);

    } catch (err) {
        const error = new Error(err.message);
        error.status = 500;
        throw error;
    }
}
