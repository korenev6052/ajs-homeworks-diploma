import GamePlay from './GamePlay';
import GameState from './GameState';
import themes from './themes';
import { User, Engine } from './Team';
import { Bowman, Swordsman } from './Character';
import { generateCharacters, generatePositionedCharacters, characterGenerator } from './generators';
import { calcActionPositions, randomItem } from './utils';
import messages from './messages';
import CharacterTypes from './character-types';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState();
    this.boardUnlocked = false;
    this.selectedCharacter = null;
    this.movePositions = [];
    this.attackPositions = [];
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateServic
    this.gamePlay.drawUi(this.gameState.theme);

    this.gamePlay.addNewGameListener(this.onNewGame.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGame.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  onNewGame() {
    this.gameState.round = 1;
    this.gameState.user = new User();
    this.gameState.engine = new Engine();

    this.newRoundInit();
    GamePlay.showMessage(messages.code101);
    this.boardUnlocked = true;
  }

  onSaveGame() {
    const save = {
      theme: this.gameState.theme,
      round: this.gameState.round,
      user: {
        player: this.gameState.user.player,
        points: this.gameState.user.points,
      },
      engine: {
        player: this.gameState.engine.player,
        points: this.gameState.engine.points,
      },
      positionedCharacters: this.gameState.positionedCharacters,
      activePlayer: this.gameState.activePlayer,
      statistics: this.gameState.statistics,
    };

    this.stateService.save(GameState.from(save));
    GamePlay.showMessage(messages.code102);
  }

  onLoadGame() {
    const load = this.stateService.load();

    if (!load) {
      GamePlay.showMessage(messages.code301);
      return false;
    }

    this.gameState.user = new User();
    this.gameState.engine = new Engine();

    this.gameState.theme = load.theme;
    this.gameState.round = load.round;
    this.gameState.user.player = load.user.player;
    this.gameState.user.points = load.user.points;
    this.gameState.engine.player = load.engine.player;
    this.gameState.engine.points = load.engine.points;
    this.gameState.activePlayer = load.activePlayer;
    this.gameState.statistics = load.statistics;

    this.gameState.positionedCharacters = load.positionedCharacters
      .map((positionedCharacter) => {
        const { player, position } = positionedCharacter;
        const {
          type, level, attack, defence, health, maxHealth,
        } = positionedCharacter.character;
        const character = new CharacterTypes[type](level);
        character.attack = attack;
        character.defence = defence;
        character.health = health;
        character.maxHealth = maxHealth;

        if (player === load.user.player) {
          this.gameState.user.addCharacter(character);
        } else {
          this.gameState.engine.addCharacter(character);
        }

        return { character, position, player };
      });

    this.gamePlay.drawUi(this.gameState.theme);
    this.gamePlay.redrawPositions(this.gameState.positionedCharacters);

    GamePlay.showMessage(messages.code103);
    if (this.gameState.activePlayer === this.gameState.user.player) {
      this.boardUnlocked = true;
    } else {
      this.activateEngine();
    }

    return true;
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    if (!this.boardUnlocked || !this.isUsersActivePlayer()) {
      this.gamePlay.setCursor('not-allowed');
      return;
    }

    this.actionWithCell(index, () => {
      // Сell is empty, users character is not selected
      this.gamePlay.setCursor('not-allowed');
    }, () => {
      // Cell is empty, users character is selected
      if (!this.canMove(index)) {
        this.gamePlay.setCursor('not-allowed');
        return;
      }

      this.gamePlay.selectCell(index, 'green');
      this.gamePlay.setCursor('pointer');
    }, (innerCharacter) => {
      // Сell is not empty, users character is not selected
      this.gamePlay.showCellTooltip(innerCharacter.character.message, index);

      if (this.isInnerUsersCharacter(innerCharacter)) {
        this.gamePlay.setCursor('pointer');
        return;
      }

      this.gamePlay.setCursor('not-allowed');
    }, (innerCharacter) => {
      // Сell is not empty, users character is selected
      this.gamePlay.showCellTooltip(innerCharacter.character.message, index);

      if (this.isInnerUsersCharacter(innerCharacter)) {
        this.gamePlay.setCursor('pointer');
        return;
      }

      if (!this.canAttack(index)) {
        this.gamePlay.setCursor('not-allowed');
        return;
      }

      this.gamePlay.selectCell(index, 'red');
      this.gamePlay.setCursor('crosshair');
    });
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    if (!this.boardUnlocked) return;

    this.gamePlay.hideCellTooltip(index);

    if (this.selectedCharacter && index !== this.selectedCharacter.position) {
      this.gamePlay.deselectCell(index);
    }
  }

  onCellClick(index) {
    // TODO: react to click
    if (!this.boardUnlocked) {
      GamePlay.showMessage(messages.code301);
      return;
    }

    if (!this.isUsersActivePlayer()) {
      GamePlay.showMessage(messages.code302);
      return;
    }

    this.actionWithCell(index, () => {
      // Сell is empty, users character is not selected
      GamePlay.showError(messages.code303);
    }, () => {
      // Cell is empty, users character is selected
      if (!this.canMove(index)) {
        GamePlay.showError(messages.code304);
        return;
      }

      this.gamePlay.deselectCell(this.selectedCharacter.position);
      this.gamePlay.deselectCell(index);
      this.moveCharacter(index);
      this.activateEngine();
    }, (innerCharacter) => {
      // Сell is not empty, users character is not selected
      if (!this.isInnerUsersCharacter(innerCharacter)) {
        GamePlay.showError(messages.code305);
        return;
      }

      this.gamePlay.selectCell(index);
      this.selectCharacter(index, innerCharacter);
    }, (innerCharacter) => {
      // Сell is not empty, users character is selected
      if (this.isInnerUsersCharacter(innerCharacter)) {
        this.gamePlay.deselectCell(this.selectedCharacter.position);
        this.gamePlay.selectCell(index);
        this.selectCharacter(index, innerCharacter);
        return;
      }

      if (!this.canAttack(index)) {
        GamePlay.showError(messages.code306);
        return;
      }

      this.gamePlay.deselectCell(this.selectedCharacter.position);
      this.gamePlay.deselectCell(index);
      this.attackCharacter(index, innerCharacter, () => {
        if (this.hasRoundWinner()) {
          this.roundUp();
          return;
        }

        this.activateEngine();
      });
    });
  }

  actionWithCell(index, callback1, callback2, callback3, callback4) {
    // Сell is empty, users character is not selected
    if (!this.isInnerCharacter(index) && !this.selectedCharacter) {
      callback1();
      return;
    }

    // Cell is empty, users character is selected
    if (!this.isInnerCharacter(index) && this.selectedCharacter) {
      callback2();
      return;
    }

    const innerCharacter = this.gameState.positionedCharacters
      .find((positionedCharacter) => positionedCharacter.position === index);

    // Сell is not empty, users character is not selected
    if (!this.selectedCharacter) {
      callback3(innerCharacter);
      return;
    }

    // Сell is not empty, users character is selected
    if (this.selectedCharacter) {
      callback4(innerCharacter);
    }
  }

  selectCharacter(index, innerCharacter) {
    this.selectedCharacter = innerCharacter;
    this.movePositions = calcActionPositions(index, innerCharacter.character.moveRadius, this.gamePlay.boardSize);
    this.attackPositions = calcActionPositions(index, innerCharacter.character.attackRadius, this.gamePlay.boardSize);
  }

  moveCharacter(index) {
    this.selectedCharacter.position = index;
    this.selectedCharacter = null;
    this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
  }

  attackCharacter(index, innerCharacter, callback) {
    const damage = Math.round(Math.max(
      this.selectedCharacter.character.attack - innerCharacter.character.defence,
      this.selectedCharacter.character.attack * 0.1,
    ));

    this.boardUnlocked = false;
    this.gamePlay.showDamage(index, damage).then(() => {
      innerCharacter.character.health -= damage;
      this.gameState.positionedCharacters = this.gameState.positionedCharacters
        .filter((positionedCharacter) => positionedCharacter.character.health > 0);
      this.selectedCharacter = null;
      this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
      this.boardUnlocked = true;
      callback();
    });
  }

  isInnerCharacter(index) {
    const innerCell = this.gamePlay.cells[index].innerHTML;
    return (innerCell.indexOf('character') !== -1);
  }

  isInnerUsersCharacter(innerCharacter) {
    return (innerCharacter.player === this.gameState.user.player);
  }

  isUsersActivePlayer() {
    return (this.gameState.activePlayer === this.gameState.user.player);
  }

  canMove(index) {
    return (this.movePositions.indexOf(index) !== -1);
  }

  canAttack(index) {
    return (this.attackPositions.indexOf(index) !== -1);
  }

  activateEngine() {
    this.gameState.activePlayer = this.gameState.engine.player;

    // Select random engines character
    const enginesPositionedCharacter = randomItem(
      this.gameState.positionedCharacters
        .filter((positionedCharacter) => positionedCharacter.player === this.gameState.engine.player),
    );
    this.selectCharacter(enginesPositionedCharacter.position, enginesPositionedCharacter);

    // Engines character is trying to attack users character
    // If an attack is not possible, then engines character moves
    const usersCharacterToAttack = this.getUsersCharacterToAttack();

    if (!usersCharacterToAttack) {
      const positionToMoveEngine = this.getPositionToMoveEngine();
      this.moveCharacter(positionToMoveEngine);
      this.gameState.activePlayer = this.gameState.user.player;
      return;
    }

    this.attackCharacter(usersCharacterToAttack.position, usersCharacterToAttack, () => {
      if (this.hasRoundWinner()) {
        this.roundUp();
        return;
      }

      this.gameState.activePlayer = this.gameState.user.player;
    });
  }

  getUsersCharacterToAttack() {
    const usersPositionedCharacters = this.gameState.positionedCharacters
      .filter((positionedCharacter) => positionedCharacter.player === this.gameState.user.player);

    return usersPositionedCharacters
      .find((userPositionedCharacter) => (this.attackPositions.indexOf(userPositionedCharacter.position) !== -1));
  }

  getPositionToMoveEngine() {
    const allowedMovePositions = this.movePositions
      .filter((movePosition) => !this.isInnerCharacter(movePosition));

    return randomItem(allowedMovePositions);
  }

  roundUp() {
    const roundWinner = this.hasRoundWinner();
    roundWinner.calcPoints();
    this.gameState.round += 1;

    if (this.gameState.round > 4) {
      let gameWinner = gameWinner = this.gameState.user;

      if (this.gameState.user.points < this.gameState.engine.points) {
        gameWinner = this.gameState.engine;
      }

      this.gameState.statistics.push({
        player: gameWinner.player,
        points: gameWinner.points,
      });
      GamePlay.showMessage(`${messages.code104} ${gameWinner.player} (${gameWinner.points} points)`);
      this.gamePlay.drawUi(this.gameState.theme);
      this.boardUnlocked = false;
      console.log(this.gameState.statistics);
      return;
    }

    GamePlay.showMessage(`${messages.code105} ${roundWinner.player} (${roundWinner.points} points)`);
    this.newRoundInit();
  }

  hasRoundWinner() {
    if (this.gameState.user.livingCharactersCount === 0) {
      return this.gameState.engine;
    }

    if (this.gameState.engine.livingCharactersCount === 0) {
      return this.gameState.user;
    }

    return null;
  }

  usersTeamUpdate() {
    if (this.gameState.round === 1) {
      this.gameState.user.characters = [new Bowman(1), new Swordsman(1)];
      return;
    }

    this.gameState.user.characters.forEach((character) => {
      character.levelUp();
      character.restoreHealth();
    });

    if (this.gameState.round === 2) {
      const randomCharacter = characterGenerator(this.gameState.user.allowedTypes, 1).next().value;
      this.gameState.user.addCharacter(randomCharacter);
      return;
    }

    const maxLevel = this.gameState.round - 1;
    const randomCharacters = generateCharacters(this.gameState.user.allowedTypes, maxLevel, 2);
    this.gameState.user.addCharacters(randomCharacters);
  }

  enginesTeamUpdate() {
    const maxLevel = this.gameState.round;
    const charactersCount = this.gameState.user.livingCharactersCount;
    const randomCharacters = generateCharacters(this.gameState.engine.allowedTypes, maxLevel, charactersCount);
    this.gameState.engine.characters = randomCharacters;
  }

  newRoundInit() {
    this.gameState.theme = themes[`round${this.gameState.round}`];
    this.gamePlay.drawUi(this.gameState.theme);

    this.usersTeamUpdate();
    this.enginesTeamUpdate();

    this.gameState.positionedCharacters = generatePositionedCharacters(
      this.gameState.user,
      this.gameState.engine,
      this.gamePlay.boardSize,
    );

    this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
    this.gameState.activePlayer = this.gameState.user.player;
    this.selectedCharacter = null;
  }
}
