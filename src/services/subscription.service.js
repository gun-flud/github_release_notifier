import crypto from "node:crypto";

import surbscribeDB from "../repositories/surbscribeDB.js";
import confirmSubscriptionDB from "../repositories/confirmSubscriptionDB.js";
import unsubscribeDB from "../repositories/unsubscribeDB.js";
import selectSubscriptionsDB from "../repositories/selectSubscriptionsDB.js";
import { sendConfirmationEmail } from "./email/emailService.js";
import { verifyRepository } from "./github.service.js";

export async function subscribeService(reqBody) {
    try {
        const { email, repo } = reqBody;
        const confirmToken = crypto.randomUUID();
        const unsubscribeToken = crypto.randomUUID();

        const data = await verifyRepository(repo);

        await surbscribeDB(email, repo, confirmToken, unsubscribeToken); //will be for storing values into server

        await sendConfirmationEmail(email, confirmToken, repo);

        const returnVal = {
            status: 201,
            message: "Confirmation letter was sent, check your email",
        };
        return returnVal;
    } catch (err) {
        const status = err.status || 500;
        const message = err.message || "Internal server error";

        return { status, message };
    }
}

export async function confirmSubscriptionService(token) {
    try {
        await confirmSubscriptionDB(token);

        return { status: 200, message: "Confirmed!" };
    } catch (err) {
        return {
            status: err.status || 500,
            message: err.message || "Server error",
        };
    }
}

export async function unsubscribeService(token) {
    try {
        await unsubscribeDB(token);

        return { status: 200, message: "Unsubscribed successfully!" };
    } catch (err) {
        return {
            status: err.status || 500,
            message: err.message || "Server error",
        };
    }
}

export async function subscriptionsService(email) {
    try {
        const data = await selectSubscriptionsDB(email);

        return { status: 200, message: data };
    } catch (err) {
        return {
            status: err.status || 500,
            message: err.message || "token is incorrect",
        };
    }
}
