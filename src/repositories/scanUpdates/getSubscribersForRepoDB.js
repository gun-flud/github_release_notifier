import { pool } from "../../db/pool.js";

export default async function getSubscribersForRepoDB (id) {
    try {
        const { rows } = await pool.query(`
        SELECT s.email, s.unsubscribe_token
        FROM subscriptions s
        WHERE s.repository_id = $1
        AND s.confirmed = TRUE
        `, [id]);

        return rows;
    } catch (err) {
        const error = new Error(err.message);
        error.status = 500;
        throw error;
    }
}
