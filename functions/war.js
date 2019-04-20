const Battle = require('./battle');
const { attackDiceByTanks, defenseDiceByTanks, canGoOn } = require('./helpers');

class War {
  constructor(initialAttackTanks, initialDefenseTanks) {
    this.initialAttackTanks = initialAttackTanks;
    this.initialDefenseTanks = initialDefenseTanks;
    this.attackTanks = this.initialAttackTanks;
    this.defenseTanks = this.initialDefenseTanks;
  }

  isDone() {
    return !canGoOn(this.attackTanks, this.defenseTanks);
  }

  battle() {
    if (!this.isDone()) {
      const attackDice = attackDiceByTanks(this.attackTanks);
      const defenseDice = defenseDiceByTanks(this.defenseTanks);
      const battle = new Battle(attackDice, defenseDice);
      const { attackLosses, defenseLosses } = battle.play();
      this.attackTanks -= attackLosses;
      this.defenseTanks -= defenseLosses;
      if (this.isDone()) {
        this.outcome = {
          winner: this.defenseTanks ? 'defense' : 'attack',
          initialAttackTanks: this.initialAttackTanks,
          initialDefenseTanks: this.initialDefenseTanks,
          attackTanks: this.attackTanks,
          defenseTanks: this.defenseTanks,
          attackLosses: this.initialAttackTanks - this.attackTanks,
          defenceLosses: this.initialDefenseTanks - this.defenseTanks
        };
      }
    }
  }

  play() {
    if (!this.isDone()) {
      while (!this.isDone()) {
        this.battle();
      }
    }
    return this.outcome;
  }
}

module.exports = War;
