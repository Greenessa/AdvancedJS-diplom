
import Character from '../Character';
export default class Daemon extends Character {
    constructor(level) {
        super (level);
        this.type = 'daemon';
        this.attack = 10;
        this.defence = 10;
        this.permitMove = 1;
        this.possibilityAttack = 4;
    }
}