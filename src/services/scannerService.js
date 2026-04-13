import cron from "node-cron";

import scanDB from "../db/scanUpdates/scanDB.js";
import { getLatestRelease } from "./githubService.js";
import { sendReleaseNotificationEmail } from "./email/emailService.js";
import updateLastSeenDB from "../db/scanUpdates/updateLastSeenDB.js";
import getSubscribersForRepoDB from "../db/scanUpdates/getSubscribersForRepoDB.js";

async function scanRepositories() {
    const repos = await scanDB();

    for (const repo of repos) {
        const latestVer = await checkRepository(repo);

        if (!latestVer) continue;
    }
}

async function checkRepository(repo) {
    const releaseData = await getLatestRelease(repo.repository_name);
    if (!releaseData) return;

    const latestTag = releaseData.tag_name;
    if (latestTag !== repo.last_seen) {
        await updateLastSeenDB(repo.id, latestTag);

        const subscribers = await getSubscribersForRepoDB(repo.id);

        for (const subscriber of subscribers) {
            const email = subscriber.email;
            const unsubToken = subscriber.unsubscribe_token;
            const repoName = repo.repository_name;
            const releaseTag = latestTag;
            const releaseUrl = releaseData.html_url;

            await sendReleaseNotificationEmail(
                email,
                unsubToken,
                repoName,
                releaseTag,
                releaseUrl,
            );
        }
    }
}

export default async function startScanner(fastify) {
    cron.schedule("15 * * * *", async () => {
        try {
            fastify.log.info("Running repository scan...");
            await scanRepositories();
            fastify.log.info("Scan complete.");
        } catch(err) {
            fastify.log.error({ err }, "Scanner failed during scheduled run");

            throw err;
        }
        
    });
}
