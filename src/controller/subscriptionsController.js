import { 
    subscribeService,
    confirmSubscriptionService,
    unsubscribeService,
    subscriptionsService } from '../services/subscriptionService.js'
export async function subscribe (req, res) {
//     const response = subscribeService(req.body);
//     res.code((await response).status).send((await response).message);

    await dataHandler(subscribeService(req.body), res);
}

export async function confirmSubscription (req, res) {
    await dataHandler(confirmSubscriptionService(req.params.token), res);
}

export async function unsubscribe (req, res) {
    await dataHandler(unsubscribeService(req.params.token), res);
}

export async function subscriptions (req, res) {
    await dataHandler(subscriptionsService(req.query.email), res);
}

async function dataHandler(fn, res) {
    const response = await fn;
    
    res.code(response.status).send(response);
}

