import * as functions from 'firebase-functions';

export const diceRoll = functions.https.onRequest((request, response) => {
  const a = Math.ceil(6 * Math.random());
 response.send(`Ho lanciato e ottenuto ${a}`);
});
