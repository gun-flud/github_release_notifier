CREATE TABLE IF NOT EXISTS repositories (
    id SERIAL PRIMARY KEY,
    repository_name VARCHAR(255) UNIQUE NOT NULL,
    last_seen VARCHAR(255) 
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY, 
    email VARCHAR(255) NOT NULL,
    repository_id INT NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    confirm_token     UUID UNIQUE NOT NULL,
    unsubscribe_token UUID UNIQUE NOT NULL,
    confirmed         BOOLEAN DEFAULT FALSE,
    created_at        TIMESTAMP DEFAULT NOW(),

  UNIQUE(email, repository_id)
);