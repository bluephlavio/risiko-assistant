// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
"use strict";

const functions = require("firebase-functions");
const { WebhookClient } = require("dialogflow-fulfillment");
const { Card, Suggestion } = require("dialogflow-fulfillment");

process.env.DEBUG = "dialogflow:debug"; // enables lib debugging statements

function roll() {
  return Math.ceil(Math.random() * 6);
}

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
  (request, response) => {
    const agent = new WebhookClient({ request, response });
    console.log(
      "Dialogflow Request headers: " + JSON.stringify(request.headers)
    );
    console.log("Dialogflow Request body: " + JSON.stringify(request.body));

    function welcome(agent) {
      agent.add(`Non vedevo l'ora di giocare a Risiko!`);
    }

    function fallback(agent) {
      agent.add(`Scusa, non ho capito.`);
      agent.add(`Mi dispiace, puoi ripetere?`);
    }

    function diceRollAttack(agent) {
      const { n } = agent.parameters;
      if (n > 0 && n < 4) {
        const values = Array.from(new Array(n).keys()).map(i => roll());
        values.sort().reverse();
        agent.setContext({
          name: "attack",
          lifespan: 3,
          parameters: {
            values: values
          }
        });
        if (n == 1) {
          agent.add(`Ho lanciato un dado ed è uscito ${values[0]}`);
        } else {
          const list =
            values.slice(0, n - 1).join(", ") + ` e ${values[n - 1]}`;
          agent.add(`Ho lanciato ${n} dadi ottenendo ${list}`);
        }
      } else {
        agent.add(`Non è possibile lanciare ${n} dadi`);
      }
    }

    function diceRollDefense(agent) {
      const attackContext = agent.getContext("attack");
      const { n } = agent.parameters;
      const values = Array.from(new Array(n).keys()).map(i => roll());
      values.sort().reverse();
      if (n == 1) {
        agent.add(`Ho lanciato un dado ed è uscito ${values[0]}`);
      } else if (n > 1 && n < 4) {
        const list = values.slice(0, n - 1).join(", ") + ` e ${values[n - 1]}`;
        agent.add(`Ho lanciato ${n} dadi ottenendo ${list}`);
      } else {
        agent.add(`Non è possibile lanciare ${n} dadi`);
      }
    }

    // // Uncomment and edit to make your own intent handler
    // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
    // // below to get this function to be run when a Dialogflow intent is matched
    // function yourFunctionHandler(agent) {
    //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
    //   agent.add(new Card({
    //       title: `Title: this is a card title`,
    //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
    //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
    //       buttonText: 'This is a button',
    //       buttonUrl: 'https://assistant.google.com/'
    //     })
    //   );
    //   agent.add(new Suggestion(`Quick Reply`));
    //   agent.add(new Suggestion(`Suggestion`));
    //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
    // }

    // // Uncomment and edit to make your own Google Assistant intent handler
    // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
    // // below to get this function to be run when a Dialogflow intent is matched
    // function googleAssistantHandler(agent) {
    //   let conv = agent.conv(); // Get Actions on Google library conv instance
    //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
    //   agent.add(conv); // Add Actions on Google library responses to your agent's response
    // }
    // // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/samples/actions-on-google
    // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set("Default Welcome Intent", welcome);
    intentMap.set("Default Fallback Intent", fallback);
    intentMap.set("Dice Roll Attack", diceRollAttack);
    intentMap.set("Dice Roll Defense", diceRollDefense);
    // intentMap.set('your intent name here', googleAssistantHandler);
    agent.handleRequest(intentMap);
  }
);
