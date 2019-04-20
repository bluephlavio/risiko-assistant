const { rollDice, sort, spellNumbers, computeLosses } = require('./helpers');
const { WarSimulator } = require('./simulators');

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
    const warSimulator = new WarSimulator(attack, defense);
    const outcomes = warSimulator.simulate();
    const attempts = outcomes.length;
    const wins = outcomes.reduce((total, outcome) => {
      const { winner } = outcome;
      return winner === 'attack' ? total + 1 : total;
    }, 0);
    const chance = wins / attempts;
    const meanSurvivors =
      outcomes.reduce((total, outcome) => {
        const { winner, attackTanks } = outcome;
        return winner === 'attack' ? total + attackTanks : total;
      }, 0) / wins;
    agent.add(`
              La probabilità di vittoria è del ${Math.floor(chance * 100)}%.
              In caso di vittoria il numero medio di sopravvissuti è di ${Math.round(
                meanSurvivors
              )} cararmatini.
              `);
  } else {
    agent.add(`Non è possibile effettuare questo attacco.`);
  }
};

const playerChoiceComment = agent => {
  const { attack, defense, name } = agent.parameters;
  if (attack > 1 && defense > 0) {
    const warSimulator = new WarSimulator(attack, defense);
    const outcomes = warSimulator.simulate();
    const attempts = outcomes.length;
    const wins = outcomes.reduce((total, outcome) => {
      const { winner } = outcome;
      return winner === 'attack' ? total + 1 : total;
    }, 0);
    const chance = wins / attempts;
    if (chance <= 0.33) {
      agent.add(`${name || ''} è scemo.`);
    } else if (chance > 0.33 && chance <= 0.66) {
      agent.add(`${name || ''} è avventato.`);
    } else {
      agent.add(`${name || ''} è un buon giocatore.`);
    }
  } else {
    agent.add(`Non sa giocare.`);
  }
};

const intentMap = new Map();

intentMap.set('Default Welcome Intent', welcome);
intentMap.set('Default Fallback Intent', fallback);
intentMap.set('Dice Roll Attack', diceRollAttack);
intentMap.set('Dice Roll Defense', diceRollDefense);
intentMap.set('Chance of Winning', chanceOfWinning);
intentMap.set('Player Choice Comment', playerChoiceComment);

module.exports = intentMap;
