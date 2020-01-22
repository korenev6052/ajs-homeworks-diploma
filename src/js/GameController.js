import themes from './themes';
import { UserTeam, ComputerTeam } from './Team';
import { generatePositionedCharacters } from './generators';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateServic
    this.gamePlay.drawUi(themes.prairie);
    const user = new UserTeam();
    const computer = new ComputerTeam();
    let positionedCharacters = generatePositionedCharacters(user, computer, this.gamePlay.boardSize);
    this.gamePlay.redrawPositions(positionedCharacters);
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
