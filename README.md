# GitHub Release Notifier

GitHub Release Notifier is a lightweight API that lets users subscribe to email updates for new releases in any public GitHub repository. It verifies repositories through the GitHub API, stores confirmed subscriptions in PostgreSQL, and sends release notifications automatically when a new version is detected.

## What it does

- Accepts subscriptions for repositories in `owner/repo` format.
- Sends a confirmation email before activating a subscription.
- Tracks confirmed subscriptions in PostgreSQL.
- Periodically scans GitHub releases and sends notification emails when a new release appears.
- Supports unsubscription through a secure tokenized link.

## Tech Stack

- Node.js
- Fastify
- PostgreSQL
- Nodemailer
- node-cron
- dotenv

## Folder Structure

```text
github_release_notifier/
├── README.md
├── package.json
├── LICENSE
├── src/
│   ├── app.js
│   ├── controller/
│   │   └── subscriptionsController.js
│   ├── db/
│   │   ├── migrations/
│   │   │   └── 01_scheme.sql
│   │   ├── migration.manager.js
│   │   ├── pool.js
│   │   ├── selectSubscriptionsDB.js
│   │   ├── surbscribeDB.js
│   │   ├── unsubscribeDB.js
│   │   └── scanUpdates/
│   │       ├── getSubscribersForRepoDB.js
│   │       ├── scanDB.js
│   │       └── updateLastSeenDB.js
│   ├── middleware/
│   ├── routes/
│   │   └── router.js
│   ├── services/
│   │   ├── api.service.js
│   │   ├── githubService.js
│   │   ├── scannerService.js
│   │   ├── subscriptionService.js
│   │   ├── api/
│   │   └── email/
│   │       └── emailService.js
│   ├── templates/
│   │   ├── confirmation.html
│   │   └── release-notification.html
│   └── utils/
│       └── paths.js
└── tests/
	├── e2e.ps1
	├── email.manual.js
	└── githubService.test.js
```

### Structure Notes

- `src/app.js` is the application entry point and starts Fastify, migrations, and the scanner.
- `src/routes/` defines the HTTP endpoints.
- `src/controller/` connects request handlers to the service layer.
- `src/services/` contains business logic, GitHub integration, email delivery, and background scanning.
- `src/db/` contains the PostgreSQL connection, query helpers, and migrations.
- `src/templates/` stores the email templates used for confirmation and release alerts.
- `tests/` contains manual, end-to-end, and service-level test helpers.

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- PostgreSQL database
- SMTP credentials for outbound email

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file in the project root with the following values:

```env
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=github_release_notifier
DB_USER=postgres
DB_PASSWORD=your_password

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
EMAIL_FROM=noreply@your-domain.com

# Optional, improves GitHub API rate limits
GITHUB_TOKEN=your_github_token
```

## Run the app

Start the API in development mode:

```bash
npm run dev
```

The server listens on `0.0.0.0` and uses the port from `PORT`.

## API Overview

All routes are mounted under `/api`.

### Subscribe

`POST /api/subscribe`

Request body:

```json
{
	"email": "user@example.com",
	"repo": "facebook/react"
}
```

Behavior:

- Validates the repository format.
- Verifies that the repository exists on GitHub.
- Creates a pending subscription.
- Sends a confirmation email.

### Confirm subscription

`GET /api/confirm/:token`

Confirms a pending subscription using the confirmation token from the email.

### Unsubscribe

`GET /api/unsubscribe/:token`

Removes a subscription using the unsubscribe token from the notification email.

### List subscriptions

`GET /api/subscriptions?email=user@example.com`

Returns confirmed subscriptions for the given email address.

## Database Schema

The project uses two main tables:

- `repositories` stores repository names and the latest seen release tag.
- `subscriptions` stores subscriber emails, confirmation tokens, unsubscribe tokens, and confirmation state.

The initial migration is located at `src/db/migrations/01_scheme.sql`.

## Release Scanning

The background scanner runs on a cron schedule and checks stored repositories for new GitHub releases. When a new release is found, it updates the last seen tag and sends notifications to all confirmed subscribers for that repository.

## Notes

- Repository names must be provided in `owner/repo` format.
- Only confirmed subscriptions receive release notifications.
- Email delivery depends on a working SMTP server.
- GitHub API requests can be rate-limited if `GITHUB_TOKEN` is not set.

## License

MIT
