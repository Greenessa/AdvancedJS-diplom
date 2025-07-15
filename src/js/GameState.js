export default class GameState {
  constructor() {
    this.positionedCharacter = [];
    this.level = 1;
    this.MaxLevel = 4;
    this.restTeamCount = undefined;
    
  }
  static from(object) {
    // TODO: create object
    if (typeof object === 'object') {
      return object;
    }
    return null;
  }
}
