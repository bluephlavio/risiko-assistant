let intentMap = new Map();

intentMap.set("Default Welcome Intent", welcome);
intentMap.set("Default Fallback Intent", fallback);
intentMap.set("Dice Roll Attack", diceRollAttack);
intentMap.set("Dice Roll Defense", diceRollDefense);

module.exports = intentMap;
