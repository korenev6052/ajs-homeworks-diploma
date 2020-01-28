import themes from './themes';

export default class GameState {
  constructor() {
    this.theme = themes.round1;
    this.statistics = [];
    this.user = {};
    this.engine = {};
    this.positionedCharacters = [];
  }

  static from(object) {
    // TODO: create object
    return null;
  }
}
