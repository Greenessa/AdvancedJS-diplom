import { generateTeam } from "./generators";
import { generatePositionedCharacter } from "./generators";
import { calcIndexArray } from "./utils";
import { createAttackZoneArr } from "./utils";
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
    this.attackPosition = undefined;
    this.opponentObj = undefined;
    this.teamCount = 3; 
    this.opponentTeamCount = this.teamCount;
    this.playerTeamCount = this.teamCount; 
    this.nameTypes = ['bowman', 'swordsman', 'magician'];
    this.nameComputerTypes = ['daemon', 'undead', 'vampire'];
    this.playerTypes = [Bowman, Swordsman, Magician]; // доступные классы игрока
    this.computerTypes = [Daemon, Undead, Vampire]; // доступные классы противника
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    
    this.gamePlay.drawUi(themes[this.gameState.level]);
    if (this.gameState.level < 2) {
      let team = generateTeam(this.playerTypes, 1, this.teamCount);
      let randomIndexArr = calcIndexArray(this.gamePlay.boardSize, 1, this.teamCount);
      this.gameState.positionedCharacter = generatePositionedCharacter(team, randomIndexArr);
      let team2 = generateTeam(this.computerTypes, 3, this.teamCount);
      let randomIndexArr2 = calcIndexArray(this.gamePlay.boardSize, 0, this.teamCount)
      let positions2 = generatePositionedCharacter(team2, randomIndexArr2);
      this.gameState.positionedCharacter.push(...positions2);
    } else {
      let team2 = generateTeam(this.computerTypes, this.gameState.level, this.teamCount);
      let randomIndexArr2 = calcIndexArray(this.gamePlay.boardSize, 0, this.teamCount)
      let positions2 = generatePositionedCharacter(team2, randomIndexArr2);
      this.gameState.positionedCharacter.push(...positions2);
    }
    
    this.gamePlay.redrawPositions(this.gameState.positionedCharacter);
    // console.log(this.gameState.positionedCharacter);
    this.markedCellQuantity = 0; // счётчик выделенного персонажа игрока 
    this.markedInd = undefined;
    this.markedCharacter = undefined;
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
    console.log('Отмеченный персонаж', obj);
    if (obj) {
      console.log('Отмечен персонаж игрока?', this.nameTypes.includes(obj.character.type));
      if (!(this.nameTypes.includes(obj.character.type))) {
        if (this.markedCellQuantity > 0) {
          let possibilityAttackZoneArr=createAttackZoneArr(this.markedInd, this.gamePlay.boardSize, this.markedCharacter.possibilityAttack);
          console.log('Возможная зона атаки выделенного персонажа',possibilityAttackZoneArr);
          console.log('Противник попадает в разрешённую зона атаки?', possibilityAttackZoneArr.includes(index)); 
          if (possibilityAttackZoneArr.includes(index)) {
            this.gamePlay.setCursor(cursors.crosshair);
            this.gamePlay.selectCell(index, 'red');
            this.attackPosition = index;
            const opponentInd = this.gameState.positionedCharacter.findIndex(
              (char) => char.position === index
            );
            this.opponentObj = this.gameState.positionedCharacter.find(
              (char) => char.position === index
            );
            console.log('атакованный противник', this.opponentObj)
            let damage = Math.max(this.markedCharacter.attack - obj.character.defence, this.markedCharacter.attack * 0.1);
            this.gamePlay.showDamage(index, damage);
            this.gameState.positionedCharacter[opponentInd].character.health -= damage;
            if (this.gameState.positionedCharacter[opponentInd].character.health < 0) {
              this.gameState.positionedCharacter.splice(opponentInd,1);
              this.opponentTeamCount -= 1
              this.attackPosition = undefined;
              this.opponentObj = undefined;
              this.gamePlay.redrawPositions(this.gameState.positionedCharacter);
            }
            setTimeout(this.gamePlay.deselectCell(index), 1000);
            this.gamePlay.deselectCell(this.markedInd);
            this.markedInd = undefined;
            this.markedCharacter = undefined;
            this.markedCellQuantity = 0;
            this.gameState.nextStep = false;
            if (this.opponentTeamCount > 0) {
              this.computerStep();
            } else {
              this.gameState.level += 1;
              if (this.gameState.level > 4) {
                this.cellClickListeners = [];
                this.cellEnterListeners = [];
                this.cellLeaveListeners = [];
                return;
              }
              this.gameState.restTeamCount = this.gameState.positionedCharacter.length;
              this.teamCount = this.gameState.restTeamCount;
              this.opponentTeamCount = this.teamCount;
              this.playerTeamCount = this.teamCount; 
              for (const char of this.gameState.positionedCharacter) {
                char.character.attack = Math.max(char.character.attack, char.character.attack * (80 + char.character.health) / 100)
                if (char.character.health + 80 > 100) {
                  char.character.health = 100;
                } else {
                  char.character.health += 80;
                }
              }
              this.init();
            }
            
          } else {
            GamePlay.showMessage('Вы превысили порог атаки для данного персонажа');
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
        // console.log(this.markedCellQuantity, this.markedInd, this.markedCharacter);
        }
      }
    } else {
      // console.log(this.markedCellQuantity, this.markedInd, this.markedCharacter.permitMove);
      // console.log(this.markedInd, this.gamePlay.boardSize, this.markedCharacter.permitMove);
      if (this.markedCellQuantity > 0) {
        let permitZoneArr=createPermitZoneArr(this.markedInd, this.gamePlay.boardSize, this.markedCharacter.permitMove);
        // console.log(permitZoneArr);
        // console.log('Разрешённая зона?', permitZoneArr.includes(index));
        if (permitZoneArr.includes(index)) {
          this.gamePlay.setCursor(cursors.pointer);
          this.gamePlay.selectCell(index, 'green');
          const newCellInd = this.gameState.positionedCharacter.findIndex(
            (char) => char.position === this.markedInd
          );
          // console.log('позиция выбранного персонажа', this.gameState.positionedCharacter[newCellInd].position);
          this.gameState.positionedCharacter[newCellInd].position = index;
          // console.log('новая позиция персонажа', this.gameState.positionedCharacter[newCellInd].position);
          this.gamePlay.redrawPositions(this.gameState.positionedCharacter);
          this.gamePlay.deselectCell(index);
          this.gamePlay.deselectCell(this.markedInd);
          this.markedInd = undefined;
          this.markedCharacter = undefined;
          this.markedCellQuantity = 0;
          this.gameState.nextStep = false;
          this.computerStep();
        } else {
          GamePlay.showMessage('Вы превысили порог перемещения для данного персонажа');
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

  computerStep () {
    let compObj = undefined;
    if (this.opponentObj) {
      compObj = this.opponentObj;
    } else {
      compObj = this.gameState.positionedCharacter.find((char) => this.nameComputerTypes.includes(char.character.type));
    };
    console.log('Персонаж противника', compObj);
    let arrRest = [];
    let possibilityAttackZoneArr=createAttackZoneArr(compObj.position, this.gamePlay.boardSize, compObj.character.possibilityAttack);
    console.log('Возможная зона атаки', possibilityAttackZoneArr);
    for (const char of this.gameState.positionedCharacter) {
      if (this.nameTypes.includes(char.character.type)) {
        if (possibilityAttackZoneArr.includes(char.position)) {
          console.log('Персонаж игрока попадает в зону атаки противника', possibilityAttackZoneArr.includes(char.position));
          this.gamePlay.setCursor(cursors.crosshair);
          this.gamePlay.selectCell(char.position, 'red');
          let damage = Math.max(compObj.character.attack - char.character.defence, compObj.character.attack * 0.1);
          this.gamePlay.showDamage(char.position, damage);
          char.character.health -= damage;
            if (char.character.health < 0) {
              let i = this.gameState.positionedCharacter.findIndex((item) => item.character.health < 0);
              this.gameState.positionedCharacter.splice(i, 1);
              this.playerTeamCount -= 1;
              this.gamePlay.redrawPositions(this.gameState.positionedCharacter);
            }
            this.gamePlay.deselectCell(char.position);
            this.gamePlay.deselectCell(compObj.position);
            if (this.playerTeamCount < 1) {
              this.cellClickListeners = [];
              this.cellEnterListeners = [];
              this.cellLeaveListeners = [];
            }
            return;
        }
      }
    }
    let permitZoneArr=createPermitZoneArr(compObj.position, this.gamePlay.boardSize, compObj.character.permitMove);
    console.log('Возможная зона перемещения противника', permitZoneArr);
    for (const char of this.gameState.positionedCharacter) {
      if (this.nameTypes.includes(char.character.type)) {
          for (let j = 0; j < permitZoneArr.length; j++) {
            // arrRest.push(Math.min(permitZoneArr[j]%this.gamePlay.boardSize, Math.abs(char.position-permitZoneArr[j])));
            arrRest.push(Math.abs(char.position-permitZoneArr[j]));
          }
          let n = arrRest.findIndex((item) => item === Math.min(...arrRest));
          console.log('индекс', n)
          let index = undefined;
          let f=true;
          index = permitZoneArr[n];
          let checkInd = undefined;
          while (f) {
            checkInd = this.gameState.positionedCharacter.findIndex(
              (char) => char.position === index
            );
            if (checkInd < 0) {
              f=false;
            } else {
              n=n+1;
              console.log('индекс', n)
              index = permitZoneArr[n];
            }
          }
          console.log('индекс перемещения', index)
          // this.gamePlay.setCursor(cursors.pointer);
          // this.gamePlay.selectCell(index, 'green');
          const newCellInd = this.gameState.positionedCharacter.findIndex(
            (char) => char.position === compObj.position
          );
          
          this.gameState.positionedCharacter[newCellInd].position = index;
          this.gamePlay.redrawPositions(this.gameState.positionedCharacter);
          // this.gamePlay.deselectCell(index);
          // this.gamePlay.deselectCell(compObj.position);
          this.gameState.nextStep = true;
          return;
      }
    }
  }
}
  

