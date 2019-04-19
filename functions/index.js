const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const intents = require('./intents');

exports.riskAssistFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  agent.handleRequest(intents);
});
