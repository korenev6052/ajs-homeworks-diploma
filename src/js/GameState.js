import themes from './themes';

export default class GameState {
  constructor() {
    this.theme = themes.default;
    this.round = null;
    this.user = null;
    this.engine = null;
    this.positionedCharacters = null;
    this.activePlater = null;
    this.statistics = null;
  }

  static from(object) {
    // TODO: create object
    if (typeof (object) === 'object') return object;

    return null;
  }
}
