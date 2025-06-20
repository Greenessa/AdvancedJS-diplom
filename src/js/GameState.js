export default class GameState {
  constructor() {
    this.positionedCharacter = [];
    this.level = 1;
    this.nextStep = true;  //true - ход игрока,  false - ход компьютера
  }
  static from(object) {
    // TODO: create object
    if (typeof object === 'object') {
      return object;
    }
    return null;
  }
}
