import crypto from 'node:crypto';

import surbscribeDB from '../db/surbscribeDB.js';
import { sendConfirmationEmail } from './email/emailService.js';
import {
    isValidRepoFormat,
    verifyRepository,
    getLatestRelease,
} from "./githubService.js";

export async function subscribeService(reqBody) {
    try {
        const { email, repo } = reqBody;
        const confirmToken = crypto.randomUUID()
        const unsubscribeToken = crypto.randomUUID()

        const data = await verifyRepository(repo);

        await surbscribeDB(email, repo, confirmToken, unsubscribeToken);//will be for storing values into server

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
        //await confirmSubscriptionDB(token);

        return { status: 200, message: "Confirmed!" };
    } catch (err) {
        return { 
            status: 500, 
            message: err.message || "token is incorrect" 
        };
    }
}

export async function unsubscribeService(token) {
    try {
        //await unsubscribeDB(token);

        return { status: 200, message: "Confirmed!" };
    } catch (err) {
        return { 
            status: 500, 
            message: err.message || "token is incorrect" 
        };
    }
}

export async function subscriptionsService(email) {
    try {
        //await selectSubscriptionsDB(email);

        return { status: 200, message: "Confirmed!" };
    } catch (err) {
        return { 
            status: 500, 
            message: err.message || "token is incorrect" 
        };
    }
}
