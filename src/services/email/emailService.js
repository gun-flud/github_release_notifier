import path from "node:path";
import fs from "node:fs/promises";
import nodemailer from "nodemailer";
import { TEMPLATES_DIR } from "../../utils/paths.js";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
});

const baseUrl = process.env.BASE_URL || "http://localhost:3000";

async function sendEmail(to, subject, html) {
    const from = process.env.EMAIL_FROM || "noreply@github-notifier.com";

    const info = await transporter.sendMail({ from, to, subject, html });
    console.log(`[Email] Sent to ${to} — messageId: ${info.messageId}`);
    console.log("[Email] Check Mailhog: http://localhost:8025");
    return info;
}

export async function sendConfirmationEmail(email, confirmToken, repoName) {
    const confirmUrl = `${baseUrl}/api/confirm/${confirmToken}`;
    const subject = `Confirm your subscription to ${repoName}`;

    let html = await fs.readFile(
        path.join(TEMPLATES_DIR, "confirmation.html"),
        "utf-8",
    );
    html = html
        .replace(/\{\{repoName\}\}/g, repoName)
        .replace(/\{\{confirmUrl\}\}/g, confirmUrl);

    return sendEmail(email, subject, html);
}

export async function sendReleaseNotificationEmail(
    email,
    unsubToken,
    repoName,
    releaseTag,
    releaseUrl,
) {
    const unsubUrl = `${baseUrl}/api/unsubscribe/${unsubToken}`;
    const subject = `New Release: ${repoName} ${releaseTag}`;

    let html = await fs.readFile(
        path.join(TEMPLATES_DIR, "release-notification.html"),
        "utf-8",
    );
    html = html
        .replace(/\{\{repoName\}\}/g, repoName)
        .replace(/\{\{releaseTag\}\}/g, releaseTag)
        .replace(/\{\{releaseUrl\}\}/g, releaseUrl)
        .replace(/\{\{unsubUrl\}\}/g, unsubUrl);

    return sendEmail(email, subject, html);
}
