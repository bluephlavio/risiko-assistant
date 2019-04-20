const rollOneDice = () => {
  return Math.ceil(Math.random() * 6);
};

const rollDice = n => {
  return Array.from(new Array(n).keys()).map(() => rollOneDice());
};

const sort = roll => {
  roll.sort().reverse();
  return roll;
};

const sortAll = (...rolls) => {
  rolls.forEach(roll => {
    sort(roll);
  });
};

const spellNumbers = roll => {
  const n = roll.length;
  return `${roll.slice(0, n - 1).join(', ')} e ${roll[n - 1]}`;
};

const computeLosses = (attack, defense) => {
  sortAll(attack, defense);
  const numbOfDiceToCompare = Math.min(attack.length, defense.length);
  const relevantAttack = attack.slice(0, numbOfDiceToCompare);
  const relevantDefense = defense.slice(0, numbOfDiceToCompare);
  const pairs = relevantAttack.map((value, index) => {
    return [value, relevantDefense[index]];
  });
  const losses = [0, 0];
  pairs.forEach(pair => {
    const attackValue = pair[0];
    const defenseValue = pair[1];
    if (attackValue > defenseValue) {
      losses[1] += 1;
    } else {
      losses[0] += 1;
    }
  });
  return losses;
};

const attackDiceByTanks = tanks => {
  return Math.min(tanks - 1, 3);
};

const defenseDiceByTanks = tanks => {
  return Math.min(tanks, 3);
};

const canGoOn = (attackTanks, defenseTanks) => {
  return attackTanks > 1 && defenseTanks > 0;
};

module.exports = {
  rollOneDice,
  rollDice,
  sort,
  sortAll,
  spellNumbers,
  computeLosses,
  attackDiceByTanks,
  defenseDiceByTanks,
  canGoOn
};
