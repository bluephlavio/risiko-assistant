import { roll } from './helpers';

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
    const values = Array.from(new Array(n).keys()).map(() => roll());
    values.sort().reverse();
    agent.setContext({
      name: 'attack',
      lifespan: 3,
      parameters: {
        values: values
      }
    });
    if (n == 1) {
      agent.add(`Ho lanciato un dado ed è uscito ${values[0]}`);
    } else {
      const list = values.slice(0, n - 1).join(', ') + ` e ${values[n - 1]}`;
      agent.add(`Ho lanciato ${n} dadi ottenendo ${list}`);
    }
  } else {
    agent.add(`Non è possibile lanciare ${n} dadi`);
  }
};

const diceRollDefense = agent => {
  // const attackContext = agent.getContext('attack');
  const { n } = agent.parameters;
  const values = Array.from(new Array(n).keys()).map(() => roll());
  values.sort().reverse();
  if (n == 1) {
    agent.add(`Ho lanciato un dado ed è uscito ${values[0]}`);
  } else if (n > 1 && n < 4) {
    const list = values.slice(0, n - 1).join(', ') + ` e ${values[n - 1]}`;
    agent.add(`Ho lanciato ${n} dadi ottenendo ${list}`);
  } else {
    agent.add(`Non è possibile lanciare ${n} dadi`);
  }
};

const intentMap = new Map();

intentMap.set('Default Welcome Intent', welcome);
intentMap.set('Default Fallback Intent', fallback);
intentMap.set('Dice Roll Attack', diceRollAttack);
intentMap.set('Dice Roll Defense', diceRollDefense);

module.exports = intentMap;
