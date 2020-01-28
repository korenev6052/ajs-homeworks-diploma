import emoji from './emoji';

export default class Character {
  constructor(level, type = 'generic') {
    this.type = type;
    this.level = level;
    this.attack = null;
    this.defence = null;
    this.health = null;
    this.maxHealth = null;
    this.moveRadius = null;
    this.attackRadius = null;

    if (new.target.name === 'Character') {
      throw new Error('User use <new Character()>');
    }
  }

  get message() {
    const level = `${emoji.medal} ${this.level} `;
    const attack = `${emoji.swords} ${this.attack} `;
    const defence = `${emoji.shield} ${this.defence} `;
    const health = `${emoji.heart} ${this.health}`;
    return level + attack + defence + health;
  }

  levelUp() {
    this.level += 1;
    this.attack = Math.round(Math.max(this.attack, this.attack * (1.8 - this.health / 100)));

    if (this.health < 0) this.health = 0;
    this.maxHealth = (this.health < 20) ? this.health + 80 : 100;
  }

  restoreHealth() {
    this.health = this.maxHealth;
  }

  isLiving() {
    return (this.health > 0);
  }
}

export class Bowman extends Character {
  constructor(level) {
    super(level, 'bowman');
    this.attack = 25;
    this.defence = 25;
    this.health = 100;
    this.maxHealth = 100;
    this.moveRadius = 2;
    this.attackRadius = 2;
  }
}

export class Daemon extends Character {
  constructor(level) {
    super(level, 'daemon');
    this.attack = 10;
    this.defence = 40;
    this.health = 100;
    this.maxHealth = 100;
    this.moveRadius = 1;
    this.attackRadius = 4;
  }
}

export class Magician extends Character {
  constructor(level) {
    super(level, 'magician');
    this.attack = 10;
    this.defence = 40;
    this.health = 100;
    this.maxHealth = 100;
    this.moveRadius = 1;
    this.attackRadius = 4;
  }
}

export class Swordsman extends Character {
  constructor(level) {
    super(level, 'swordsman');
    this.attack = 40;
    this.defence = 10;
    this.health = 100;
    this.maxHealth = 100;
    this.moveRadius = 4;
    this.attackRadius = 1;
  }
}

export class Undead extends Character {
  constructor(level) {
    super(level, 'undead');
    this.attack = 25;
    this.defence = 25;
    this.health = 100;
    this.maxHealth = 100;
    this.moveRadius = 4;
    this.attackRadius = 1;
  }
}

export class Vampire extends Character {
  constructor(level) {
    super(level, 'vampire');
    this.attack = 40;
    this.defence = 10;
    this.health = 100;
    this.maxHealth = 100;
    this.moveRadius = 2;
    this.attackRadius = 2;
  }
}
