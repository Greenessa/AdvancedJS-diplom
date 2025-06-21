import { generateTeam } from "./generators";
import { generatePositionedCharacter } from "./generators";
import { calcIndexArray } from "./utils";
import { createPermitZoneArr } from "./utils";
import GameState from "./GameState";
import Bowman from "./characters/Bowman";
import Swordsman from "./characters/Swordsman";
import Magician from "./characters/Magician";
import Daemon from "./characters/Daemon";
import Undead from "./characters/Undead";
import Vampire from "./characters/Vampire";
import themes from "./themes";
import cursors from "./cursors";
import GamePlay from "./GamePlay";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.markedCellQuantity = 0; // счётчик выделенного персонажа игрока 
    this.markedInd = undefined;
    this.markedCharacter = undefined; //выбранный игроком персонаж
    this.gameState = new GameState();
    this.nameTypes = ['bowman', 'swordsman', 'magician'];
    this.playerTypes = [Bowman, Swordsman, Magician]; // доступные классы игрока
    this.computerTypes = [Daemon, Undead, Vampire]; // доступные классы противника
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes[this.gameState.level]);
    let team = generateTeam(this.playerTypes, 3, 4);
    let randomIndexArr = calcIndexArray(this.gamePlay.boardsize, 1, 4);
    this.gameState.positionedCharacter = generatePositionedCharacter(team, randomIndexArr); 
    let team2 = generateTeam(this.computerTypes, 3, 4);
    let randomIndexArr2 = calcIndexArray(this.gamePlay.boardsize, 0, 4)
    let positions2 = generatePositionedCharacter(team2, randomIndexArr2);
    this.gameState.positionedCharacter.push(...positions2);
    this.gamePlay.redrawPositions(this.gameState.positionedCharacter);
    console.log(this.gameState.positionedCharacter);
    this.addCellListeners();
    this.addGameListeners();
    
    // this.stateService.load();
  }

  addCellListeners() { // <- что это за метод и где это нужно сделать решите сами
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
 }

 
  onCellClick(index) {
    // TODO: react to click
    const obj = this.gameState.positionedCharacter.find(
      (char) => char.position === index
    );
    
    if (obj) {
      console.log(this.nameTypes.includes(obj.character.type));
      if (!(this.nameTypes.includes(obj.character.type))) {
        if (this.markedCellQuantity > 0) {
          let possibilityAttackZoneArr=createPermitZoneArr(this.markedInd, this.gamePlay.boardsize, this.markedCharacter.possibilityAttack);
          if (possibilityAttackZoneArr.includes(index)) {
            this.gamePlay.setCursor(cursors.crosshair);
            this.gamePlay.selectCell(index, 'red');
            const opponentInd = this.gameState.positionedCharacter.findIndex(
              (char) => char.position === index
            );
            this.gameState.positionedCharacter[opponentInd].character.health -= Math.max(this.markedCharacter.attack - obj.character.defence, this.markedCharacter.attack * 0.1);
            if (this.gameState.positionedCharacter[opponentInd].character.health < 0) {
              this.gameState.positionedCharacter.splice(opponentInd,1);
              this.gamePlay.redrawPositions(this.gameState.positionedCharacter);
            }
            this.markedInd = undefined;
            this.markedCharacter = undefined;
            this.markedCellQuantity = 0;
            his.gameState.nextStep = false;
          }
        } else {
          GamePlay.showMessage('Этот персонаж команды противника');
        }
      } else {
        if (this.markedCellQuantity === 0) {
        this.gamePlay.selectCell(index);
        this.markedCellQuantity++;
        this.markedInd = index;
        this.markedCharacter = obj.character;
        }
      }
    } else {
      if (this.markedCellQuantity > 0) {
        let permitZoneArr=createPermitZoneArr(this.markedInd, this.gamePlay.boardsize, this.markedCharacter.permitMove);
        console.log(permitZoneArr);
        if (permitZoneArr.includes(index)) {
          this.gamePlay.setCursor(cursors.pointer);
          this.gamePlay.selectCell(index, 'green');
          // const newCellInd = this.gameState.positionedCharacter.findIndex(
          //   (char) => char.position === index
          // );
          this.gameState.positionedCharacter[this.markedInd].position = index;
          this.gamePlay.redrawPositions(this.gameState.positionedCharacter);
          this.gamePlay.deselectCell(index);
          this.deselectCell(this.markedInd);
          this.markedInd = undefined;
          this.markedCharacter = undefined;
          this.markedCellQuantity = 0;
          this.gameState.nextStep = false;
        }
      }
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const obj = this.gameState.positionedCharacter.find(
      (char) => char.position === index
    );
    if (obj) {
      const { level, attack, defence, health } = obj.character;
      const medal ='\u{1F396}';
      const swords ='\u{2694}';
      const shield ='\u{1F6E1}';
      const heart ='\u{2764}';
      let info = `${medal}${level} ${swords}${attack} ${shield}${defence} ${heart}${health}`;
      this.gamePlay.showCellTooltip(info, index);
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
  }

  addGameListeners() {
    this.gamePlay.addNewGameListener(this.onNewGame.bind(this));
    // this.gamePlay.addSaveGameListener(this.onSaveGame.bind(this));
    // this.gamePlay.addLoadGameListener(this.onLoadGame.bind(this));
   }
  onNewGame() {
    this.init();
  }
}
