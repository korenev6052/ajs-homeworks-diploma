import themes from './themes';
import { UserTeam, ComputerTeam } from './Team';

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
    console.log(JSON.stringify(user.characters));
    const computer = new ComputerTeam();
    console.log(JSON.stringify(computer.characters));

    user.updateByRound(2);
    console.log(JSON.stringify(user.characters));
    computer.updateByRound(2, user.livingCharactersCount);
    console.log(JSON.stringify(computer.characters));

    user.updateByRound(3);
    console.log(JSON.stringify(user.characters));
    computer.updateByRound(3, user.livingCharactersCount);
    console.log(JSON.stringify(computer.characters));
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
