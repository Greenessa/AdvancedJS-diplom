import Character from '../Character';
export default class Undead extends Character {
    constructor(level) {
        super (level);
        this.type = 'undead';
        this.attack = 40;
        this.defence = 10;
        this.permitMove = 4;
        this.possibilityAttack = 1;
    }
}