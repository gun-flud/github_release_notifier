import { pool } from "../db/pool.js";

export default async function selectSubscriptionsDB(email) {
    const { rows } = await pool.query(
        `
        SELECT s.id, s.created_at, s.email, r.repository_name 
        FROM subscriptions s
        JOIN repositories r ON s.repository_id = r.id
        WHERE s.email = $1 AND s.confirmed = TRUE`,
        [email],
    );

    return rows;
}
