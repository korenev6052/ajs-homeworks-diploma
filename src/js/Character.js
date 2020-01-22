export default class Character {
  constructor(level, type = 'generic') {
    this.type = type;
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.currentHealth = this.health;

    if (new.target.name === 'Character') {
      throw new Error('User use <new Character()>');
    }
  }

  levelUp() {
    this.level += 1;
    this.attack = Math.max(this.attack, this.attack * (1.8 - this.currentHealth / 100));
    this.health = (this.currentHealth < 20) ? this.currentHealth + 80 : 100;
  }

  restoreCurrentHealth() {
    this.currentHealth = this.health;
  }

  isLiving() {
    return (this.currentHealth) ? true : false;
  }
}

export class Bowman extends Character {
  constructor(level) {
    super(level, 'Bowman');
    this.attack = 25;
    this.defence = 25;
    this.health = 100;
  }
}

export class Daemon extends Character {
  constructor(level) {
    super(level, 'Daemon');
    this.attack = 10;
    this.defence = 40;
    this.health = 100;
  }
}

export class Magician extends Character {
  constructor(level) {
    super(level, 'Magician');
    this.attack = 10;
    this.defence = 40;
    this.health = 100;
  }
}

export class Swordsman extends Character {
  constructor(level) {
    super(level, 'Swordsman');
    this.attack = 40;
    this.defence = 10;
    this.health = 100;
  }
}

export class Undead extends Character {
  constructor(level) {
    super(level, 'Undead');
    this.attack = 25;
    this.defence = 25;
    this.health = 100;
  }
}

export class Vampire extends Character {
  constructor(level) {
    super(level, 'Vampire');
    this.attack = 40;
    this.defence = 10;
    this.health = 100;
  }
}
