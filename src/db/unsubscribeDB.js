import { pool } from "./pool.js";

export default async function unsubscribeDB(token) {
    const { rows } = await pool.query(
        `
        DELETE FROM subscriptions
        WHERE unsubscribe_token = $1
        RETURNING id`,
        [token],
    );

    

    if (rows.length === 0) {
        const err = new Error('Token is invalid');
        err.status = 404;
        throw err;
    }
}
