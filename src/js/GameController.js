import GamePlay from './GamePlay';
import GameState from './GameState';
import themes from './themes';
import { User, Engine } from './Team';
import { Bowman, Swordsman } from './Character';
import { generateCharacters, generatePositionedCharacters } from './generators';
import { calcActionPositions, randomItem } from './utils';
import errors from './errors';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.boardUnlocked = false;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateServic
    this.gamePlay.drawUi(themes.prairie);

    this.gamePlay.addNewGameListener(this.onNewGame.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  onNewGame() {
    this.gameState = new GameState();
    this.gameState.theme = themes.prairie;
    this.gamePlay.drawUi(this.gameState.theme);

    this.gameState.user = new User();
    this.gameState.user.addCharacters([new Bowman(1), new Swordsman(1)]);

    this.gameState.engine = new Engine();
    const randomCharacters = generateCharacters(this.gameState.engine.allowedTypes, 1, 2);
    this.gameState.engine.addCharacters(randomCharacters);

    this.gameState.positionedCharacters = generatePositionedCharacters(
      this.gameState.user,
      this.gameState.engine,
      this.gamePlay.boardSize,
    );
    this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
    this.gameState.acivePlayer = this.gameState.user.player;
    this.selectedCharacter = null;
    this.boardUnlocked = true;
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
      GamePlay.showMessage(errors.code301);
      return;
    }

    if (!this.isUsersActivePlayer()) {
      GamePlay.showMessage(errors.code302);
      return;
    }

    this.actionWithCell(index, () => {
      // Сell is empty, users character is not selected
      GamePlay.showError(errors.code303);
    }, () => {
      // Cell is empty, users character is selected
      if (!this.canMove(index)) {
        GamePlay.showError(errors.code304);
        return;
      }

      this.gamePlay.deselectCell(this.selectedCharacter.position);
      this.gamePlay.deselectCell(index);
      this.moveCharacter(index);
      this.activateEngine();
    }, (innerCharacter) => {
      // Сell is not empty, users character is not selected
      if (!this.isInnerUsersCharacter(innerCharacter)) {
        GamePlay.showError(errors.code305);
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
        GamePlay.showError(errors.code306);
        return;
      }

      this.attackCharacter(index, innerCharacter, () => {
        this.activateEngine();
      });
    });
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
    const damage = Math.max(
      this.selectedCharacter.character.attack - innerCharacter.character.defence,
      this.selectedCharacter.character.attack * 0.1,
    );
    this.gamePlay.deselectCell(this.selectedCharacter.position);
    this.gamePlay.deselectCell(index);
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
    return (this.gameState.acivePlayer === this.gameState.user.player);
  }

  canMove(index) {
    return (this.movePositions.indexOf(index) !== -1);
  }

  canAttack(index) {
    return (this.attackPositions.indexOf(index) !== -1);
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

  activateEngine() {
    this.gameState.acivePlayer = this.gameState.engine.player;

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
      this.gameState.acivePlayer = this.gameState.user.player;
      return;
    }

    this.attackCharacter(usersCharacterToAttack.position, usersCharacterToAttack, () => {
      this.gameState.acivePlayer = this.gameState.user.player;
    });
  }

  getUsersCharacterToAttack() {
    const usersPositionedCharacters = this.gameState.positionedCharacters
      .filter((positionedCharacter) => positionedCharacter.player === this.gameState.user.player);

    return usersPositionedCharacters.find((userPositionedCharacter) => {
      return (this.attackPositions.indexOf(userPositionedCharacter.position) !== -1);
    });
  }

  getPositionToMoveEngine() {
    const allowedMovePositions = this.movePositions
      .filter((movePosition) => !this.isInnerCharacter(movePosition));

    return randomItem(allowedMovePositions);
  }
}
