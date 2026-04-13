import { pool } from "../../db/pool.js";

export default async function scanDB() {
    try {
        const { rows } = await pool.query(`
        SELECT r.id, r.repository_name, r.last_seen 
        FROM repositories r
        WHERE EXISTS (
        SELECT 1
        FROM subscriptions s
        WHERE s.repository_id = r.id
        AND s.confirmed = TRUE
        LIMIT 1
        )
        `);

        return rows;
    } catch (err) {
        console.error("DB scan failed:", err);
        throw new Error("Failed to fetch repositories");
    }
}
