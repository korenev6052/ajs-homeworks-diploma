import GamePlay from './GamePlay';
import GameState from "./GameState";
import themes from "./themes";
import { User, Engine } from "./Team";
import { Bowman, Swordsman } from "./Character";
import { generateCharacters, generatePositionedCharacters } from "./generators";
import { calcActionPositions } from './utils';
import errors from './errors';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameStarted = false;
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
      this.gamePlay.boardSize
    );
    this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
    this.gameState.acivePlayer = this.gameState.user.player;
    this.gameStarted = true;
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    if (!this.gameStarted || !this.isUsersActivePlayer()) {
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
    if (!this.gameStarted) return;

    this.gamePlay.hideCellTooltip(index);

    if (this.selectedCharacter && index !== this.selectedCharacter.position) {
      this.gamePlay.deselectCell(index);
    }
  }

  onCellClick(index) {
    // TODO: react to click
    if (!this.gameStarted) {
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
      this.selectedCharacter.position = index;
      this.selectedCharacter = null;
      this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
      this.gameState.acivePlayer = this.gameState.engine.player;
    }, (innerCharacter) => {
      // Сell is not empty, users character is not selected
      if (!this.isInnerUsersCharacter(innerCharacter)) {
        GamePlay.showError(errors.code305);
        return;
      }

      this.selectCharacter(index, innerCharacter);
    }, (innerCharacter) => {
      // Сell is not empty, users character is selected
      if (this.isInnerUsersCharacter(innerCharacter)) {
        this.gamePlay.deselectCell(this.selectedCharacter.position);
        this.selectCharacter(index, innerCharacter);
        return;
      }

      if (!this.canAttack(index)) {
        GamePlay.showError(errors.code306);
        return;
      }
    });
  }

  selectCharacter(index, innerCharacter) {
    this.gamePlay.selectCell(index);
    this.selectedCharacter = innerCharacter;
    this.movePositions = calcActionPositions(index, innerCharacter.character.moveRadius, this.gamePlay.boardSize);
    this.attackPositions = calcActionPositions(index, innerCharacter.character.attackRadius, this.gamePlay.boardSize);
  }

  isInnerCharacter(index) {
    const innerCell = this.gamePlay.cells[index].innerHTML;
    return (innerCell.indexOf('character') !== -1) ? true : false;
  }

  isInnerUsersCharacter(innerCharacter) {
    return (innerCharacter.player === this.gameState.user.player) ? true : false;
  }

  isUsersActivePlayer() {
    return (this.gameState.acivePlayer === this.gameState.user.player) ? true : false;
  }

  canMove(index) {
    return (this.movePositions.indexOf(index) !== -1) ? true : false;
  }

  canAttack(index) {
    return (this.attackPositions.indexOf(index) !== -1) ? true : false;
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
      return;
    }
  }
}
