import Character, { Bowman, Daemon, Magician, Swordsman, Vampire, Undead } from './Character';

export default class Team {
  constructor(player, allowedTypes) {
    this.player = player;
    this.allowedTypes = allowedTypes;
    this._characters = new Set();

    if (new.target.name === 'Team') {
      throw new Error('User use <new Team()>');
    }
  }

  get characters() {
    return Array.from(this._characters);
  }

  get charactersCount() {
    return this._characters.size;
  }

  get livingCharacters() {
    return this.characters.filter((character) => character.isLiving());
  }

  get livingCharactersCount() {
    return this.characters.reduce((count, character) => {
      if (character.isLiving()) count += 1;
    }, 0);
  }

  addCharacter(character) {
    if (!(character instanceof Character)) {
      throw new Error('Character must be instance of Character or its children');
    }

    this._characters.add(character);
  }

  addCharacters(characters) {
    characters.forEach((character) => this.addCharacter(character));
  }

  charactersLevelUp() {
    this._characters.forEach((character) => {
      if (character.isLiving()) {
        character.restoreHealth();
        character.levelUp();
      }
    });
  }
}

export class User extends Team {
  constructor() {
    super('user', [Swordsman, Bowman, Magician]);
  }
}

export class Engine extends Team {
  constructor() {
    super('engine', [Daemon, Undead, Vampire]);
  }
}
