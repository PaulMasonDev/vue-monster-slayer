function getRandomValue(min, max) {
  //Formula for calculating random number between 5 and 12.
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      monsterHealth: 100,
      playerHealth: 100,
      specialAttackCooldown: 0,
      healCooldown: 0,
      gameResults: "",
      battleLog: [],
    };
  },
  watch: {
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        this.gameResults = "It was a draw!";
      } else if (value <= 0) {
        this.gameResults = "You win!";
      }
    },
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        this.gameResults = "It was a draw!";
      } else if (value <= 0) {
        this.gameResults = "You lost!";
      }
    },
  },
  computed: {
    monsterBarStyles() {
      if (this.monsterHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.monsterHealth + "%" };
    },
    playerBarStyles() {
      if (this.playerHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.playerHealth + "%" };
    },
    specialAttackDisabled() {
      return this.specialAttackCooldown !== 0;
    },
    healDisabled() {
      return this.healCooldown !== 0;
    },
    actionClass() {},
  },
  methods: {
    attackMonster() {
      const attackValue = getRandomValue(5, 12);
      this.monsterHealth -= attackValue;
      this.monsterHealth < 0 ? (this.monsterHealth = 0) : null;
      this.addLogMessage("Player", "Attack", attackValue);
      this.attackPlayer();
      this.specialAttackCooldown > 0 ? this.specialAttackCooldown-- : null;
      this.healCooldown > 0 ? this.healCooldown-- : null;
    },
    attackPlayer() {
      const attackValue = getRandomValue(8, 15);
      this.playerHealth -= attackValue;
      this.playerHealth < 0 ? (this.playerHealth = 0) : null;
      this.addLogMessage("Monster", "Attack", attackValue);
    },
    specialAttackMonster() {
      if (this.specialAttackCooldown === 0) {
        const attackValue = getRandomValue(10, 25);
        this.monsterHealth -= attackValue;
        this.monsterHealth < 0 ? (this.monsterHealth = 0) : null;
        this.specialAttackCooldown = 2;
        this.addLogMessage("Player", "Special Attack", attackValue);
        this.attackPlayer();
      }
    },
    healPlayer() {
      if (this.healCooldown === 0) {
        const healValue = getRandomValue(8, 20);
        this.playerHealth += healValue;
        this.playerHealth + healValue > 100
          ? (this.playerHealth = 100)
          : (this.playerHealth += healValue);
        this.healCooldown = 2;
        this.attackPlayer();
        this.addLogMessage("Player", "Heal", healValue);
      }
    },
    surrender() {
      this.gameResults = "Surrendered! You lost to the monster";
    },
    newGame() {
      this.monsterHealth = 100;
      this.playerHealth = 100;
      this.specialAttackCooldown = 0;
      this.healCooldown = 0;
      this.gameResults = "";
      this.battleLog = [];
    },
    addLogMessage(who, what, value) {
      this.battleLog.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
      this.battleLog.length > 10 ? this.battleLog.pop() : null;
    },
  },
}).mount("#game");
