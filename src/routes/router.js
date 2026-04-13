import { 
    subscribe,
    confirmSubscription,
    unsubscribe,
    subscriptions } from '../controller/subscriptionsController.js';

export default function routes (fastify, components, done) {

    fastify.post('/subscribe', subscribe);

    fastify.get('/confirm/:token', confirmSubscription);

    fastify.get('/unsubscribe/:token', unsubscribe);

    fastify.get('/subscriptions', subscriptions);

    done();
}