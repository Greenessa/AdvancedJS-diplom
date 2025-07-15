import Team from "./Team";
import PositionedCharacter from "./PositionedCharacter";


/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  // let level = Math.floor(Math.random() * (maxLevel - 1 + 1)) + 1;
  let iTypes = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
  let nameClass = allowedTypes[iTypes];
  while (true) {
    yield new nameClass(maxLevel);
  }
}

export function* indexGenerator (indexArr) {
  while (true) {
    let indItem = Math.floor(Math.random()*indexArr.length);
    yield indexArr[indItem];
  }
}


/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  let teamGroup = [];
  for (let index = 0; index < characterCount; index++) {
    const playerGenerator = characterGenerator(allowedTypes, maxLevel);
    let player = playerGenerator.next().value;
    teamGroup.push(player);
  }
  return new Team(teamGroup);
}

export function generatePositionedCharacter(team, randomIndexArr) {
  let positionedCharacter = [];
  for (let index = 0; index < randomIndexArr.length; index++) {
    positionedCharacter.push(new PositionedCharacter(team.teamGroup[index], randomIndexArr[index]))
  }
  return positionedCharacter;
}
