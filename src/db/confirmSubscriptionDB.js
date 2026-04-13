import { pool } from './pool.js';

export default async function confirmSubscriptionDB (token) {
    const { rows } = await pool.query(
        `UPDATE subscriptions SET confirmed = TRUE
        WHERE confirm_token = $1
        AND confirmed = FALSE`, [token]
    );

    if (rows.length === 0) {
        const err = new Error('Token is invalid or already used');
        err.status = 404;
        throw err;
    } 

}