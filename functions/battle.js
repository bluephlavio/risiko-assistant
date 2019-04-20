const { rollDice, computeLosses } = require('./helpers');

class Battle {
  constructor(attack, defense) {
    this.attack = attack;
    this.defense = defense;
  }

  isDone() {
    return !!this.outcome;
  }

  play() {
    if (!this.isDone()) {
      const attackDiceRoll = rollDice(this.attack);
      const defenseDiceRoll = rollDice(this.defense);
      const [attackLosses, defenseLosses] = computeLosses(attackDiceRoll, defenseDiceRoll);
      this.outcome = {
        attackDiceRoll,
        defenseDiceRoll,
        attackLosses,
        defenseLosses
      };
    }
    return this.outcome;
  }
}

module.exports = Battle;
