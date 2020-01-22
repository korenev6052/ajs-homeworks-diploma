import { Bowman, Daemon, Magician, Swordsman, Vampire, Undead } from './Character';
import { characterGenerator, generateTeam } from './generators';

export default class Team {
  constructor(player, allowedTypes) {
    this._player = player;
    this._allowedTypes = allowedTypes;
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

  get livingCharactersCount() {
    let count = 0;
    this._characters.forEach((character) => {
      if (character.isLiving()) count += 1;
    });
    return count;
  }

  charactersLevelUp() {
    this._characters.forEach((character) => {
      if (character.isLiving()) {
        character.restoreCurrentHealth();
        character.levelUp();
      }
    });
  }
}

export class UserTeam extends Team {
  constructor() {
    super('user', [Swordsman, Bowman, Magician]);
    this.updateByRound(1);
  }

  updateByRound(round) {
    switch (round) {
      case 1:
        this._characters.add(new Bowman(1));
        this._characters.add(new Swordsman(1));
        break;
      case 2:
        this.charactersLevelUp();
        const generator = characterGenerator(this._allowedTypes, 1);
        this._characters.add(generator.next().value);
        break;
      default:
        this.charactersLevelUp();
        generateTeam(this._allowedTypes, round - 1, 2)
          .forEach((character) => this._characters.add(character));
    }
  }
}

export class ComputerTeam extends Team {
  constructor() {
    super('computer', [Daemon, Undead, Vampire]);
    this.updateByRound(1, 2);
  }

  updateByRound(round, userCharactersCount) {
    this._characters.clear();
    generateTeam(this._allowedTypes, round, userCharactersCount)
      .forEach((character) => this._characters.add(character));
  }
}
