import Character from './Character';

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