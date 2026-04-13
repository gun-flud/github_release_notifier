import { pool } from "./pool.js";

export default async function surbscribeDB(
    email,
    repo,
    confirmToken,
    unsubscribeToken,
) {
    const {rows} = await pool.query(
        `
        INSERT INTO repositories (repository_name) 
        VALUES($1) 
        ON CONFLICT (repository_name)
        DO UPDATE SET repository_name = EXCLUDED.repository_name
        RETURNING id`,
        [repo],
    );
    const repositoryId = rows[0].id;

    await pool.query(
        `
        INSERT INTO subscriptions( email, repository_id, confirm_token, unsubscribe_token ) VALUES($1, $2, $3, $4)`,
        [email, repositoryId, confirmToken, unsubscribeToken],
    );
}
