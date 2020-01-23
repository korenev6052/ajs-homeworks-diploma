import themes from './themes';
import { UserTeam, ComputerTeam } from './Team';
import { generatePositionedCharacters } from './generators';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.positionedCharacters = [];
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateServic
    this.gamePlay.drawUi(themes.prairie);
    const user = new UserTeam();
    const computer = new ComputerTeam();
    this.positionedCharacters = generatePositionedCharacters(user, computer, this.gamePlay.boardSize);
    this.gamePlay.redrawPositions(this.positionedCharacters);
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));

  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    if (this.gamePlay.cells[index].innerHTML !== '') {
      const positionedCharacter = this.positionedCharacters.find((positionedCharacter) => {
        return positionedCharacter.position === index;
      });
      this.gamePlay.showCellTooltip(positionedCharacter.character.message, index);
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
  }
}
