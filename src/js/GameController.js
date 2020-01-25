import GamePlay from './GamePlay';
import GameState from "./GameState";
import themes from "./themes";
import { User, Engine } from "./Team";
import { Bowman, Swordsman } from "./Character";
import { generateCharacters, generatePositionedCharacters } from "./generators";
import { calcActionPositions } from './utils';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateServic
    this.gamePlay.drawUi(themes.prairie);

    this.gamePlay.addNewGameListener(this.onNewGame.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));

    calcActionPositions(44, 4, 8);
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
    this.gameState.step = this.gameState.user.player;
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    if (this.gamePlay.cells[index].innerHTML === '') return;

    const { character } = this.gameState.positionedCharacters
      .find((positionedCharacter) => positionedCharacter.position === index);
    this.gamePlay.showCellTooltip(character.message, index);
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
  }

  onCellClick(index) {
    // TODO: react to click
    if (this.selectedCell !== index && this.sectedCell !== undefined) {
      this.gamePlay.deselectCell(this.sectedCell);
    }

    this.sectedCell = index;

    if (this.gamePlay.cells[index].innerHTML == '') return;

    const { player } = this.gameState.positionedCharacters
      .find((positionedCharacter) => positionedCharacter.position === index);

    if (this.gameState.user.player === player && this.gameState.step === player) {
      this.gamePlay.selectCell(index);
    } else {
      GamePlay.showError('Select user character');
    }
  }
}
