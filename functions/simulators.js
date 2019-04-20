const Battle = require('./battle');
const War = require('./war');

class BattleSimulator {
  constructor(attack, defense, attempts = 1000) {
    this.attack = attack;
    this.defense = defense;
    this.attempts = attempts;
    this.outcomes = [];
  }

  isDone() {
    return this.outcomes.length === this.attempts;
  }

  simulate() {
    const remaining = this.attempts - this.outcomes.length;
    for (let i = 0; i < remaining; i += 1) {
      const battle = new Battle(this.attack, this.defense);
      const outcome = battle.play();
      this.outcomes.push(outcome);
    }
    return this.outcomes;
  }
}

class WarSimulator {
  constructor(attackTanks, defenseTanks, attempts = 1000) {
    this.attackTanks = attackTanks;
    this.defenseTanks = defenseTanks;
    this.attempts = attempts;
    this.outcomes = [];
  }

  isDone() {
    return this.outcomes.length === this.attempts;
  }

  simulate() {
    const remaining = this.attempts - this.outcomes.length;
    for (let i = 0; i < remaining; i += 1) {
      const war = new War(this.attackTanks, this.defenseTanks);
      const outcome = war.play();
      this.outcomes.push(outcome);
    }
    return this.outcomes;
  }
}

module.exports = {
  BattleSimulator,
  WarSimulator
};
