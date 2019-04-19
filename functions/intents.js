const { rollDice, sort, spellNumbers, computeLosses, chance } = require('./helpers');

const welcome = agent => {
  agent.add(`Non vedevo l'ora di giocare a Risiko!`);
};

const fallback = agent => {
  agent.add(`Scusa, non ho capito.`);
  agent.add(`Mi dispiace, puoi ripetere?`);
};

const diceRollAttack = agent => {
  const { n } = agent.parameters;
  if (n > 0 && n < 4) {
    const roll = sort(rollDice(n));
    agent.setContext({
      name: 'attack',
      lifespan: 3,
      parameters: {
        roll
      }
    });
    agent.add(`Ho lanciato ed è uscito ${spellNumbers(roll)}`);
  } else {
    agent.add(`Non è possibile lanciare ${n} dadi`);
  }
};

const diceRollDefense = agent => {
  const { n } = agent.parameters;
  if (n > 0 && n < 4) {
    const defenseRoll = sort(rollDice(n));
    const attackContext = agent.getContext('attack');
    const attackRoll = attackContext.parameters.roll;
    const losses = computeLosses(attackRoll, defenseRoll);
    agent.add(
      `
      Ho lanciato ed è uscito ${spellNumbers(defenseRoll)}. 
      L'attacco perde ${losses[0]} cararmatini mentre la difesa ne perde ${losses[1]}.
      `
    );
  } else {
    agent.add(`Non è possibile lanciare ${n} dadi`);
  }
};

const chanceOfWinning = agent => {
  const { attack, defense } = agent.parameters;
  if (attack > 1 && defense > 0) {
    const p = chance(attack, defense);
    agent.add(`La probabilità di vittoria è del ${Math.floor(p * 100)}%.`);
  } else {
    agent.add(`Non è possibile effettuare questo attacco.`);
  }
};

const intentMap = new Map();

intentMap.set('Default Welcome Intent', welcome);
intentMap.set('Default Fallback Intent', fallback);
intentMap.set('Dice Roll Attack', diceRollAttack);
intentMap.set('Dice Roll Defense', diceRollDefense);
intentMap.set('Chance of Winning', chanceOfWinning);

module.exports = intentMap;
