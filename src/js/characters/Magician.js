import Character from '../Character';
export default class Magician extends Character {
    constructor(level) {
        super (level);
        this.type = 'magician';
        this.attack = 40;
        this.defence = 10;
        this.permitMove = 1;
        this.possibilityAttack = 4;
    }
}