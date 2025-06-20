import { indexGenerator } from "./generators";

/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
  let n = (boardSize**2)-1;
  switch (index) {
    case n:
      return 'bottom-right';
    case (n-boardSize+1):
      return 'bottom-left';
    case 0:
      return 'top-left';
    case (boardSize-1):
      return 'top-right';
  }
  if (index < boardSize && index > 0) {
    return 'top';
  }
  if (index < n && index > (n-boardSize+1)) {
    return 'bottom';
  }
  if (index > 0 && (index%boardSize) == 0) {
    return 'left';
  }
  if (index > boardSize-1 && ((index+1)%boardSize)==0) {
    return 'right';
  }
  // TODO: ваш код будет тут
  return 'center';
  }

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
/**
 * Формирует массив случайно выбранных индексов поля из разрешённых столбцов
 * для размещения команды персонажей
 * @param flag - 1 - индексы для команды игрока, не 1 - команды соперника
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @param characterCount -кодличество персонажей в команде
 * @returns массив случайно выбранных индексов поля:
 * */
export function calcIndexArray (boardSize, flag, characterCount) {
  let indexArr = [];
  let randomIndexArr = [];
  let n = boardSize**2;
  if (flag === 1) {
    for (let index = 0; index < (n-1); index=index+boardSize) {
      indexArr.push(index);
      indexArr.push(index+1);
    }
  } else {
    for (let index = boardSize-2; index < (n-1); index=index+boardSize) {
      indexArr.push(index);
      indexArr.push(index+1);
    }
  }
  const indGener = indexGenerator(indexArr);
  while (randomIndexArr.length < characterCount) {
    let indItem =indGener.next().value;
    if (!randomIndexArr.includes(indItem)) {
      randomIndexArr.push(indItem);
  }}
  return randomIndexArr;
}

export function createPermitZoneArr (index, boardSize, permitMove) {
  let permitZoneArr = [];
  let iStart = index-(permitMove*boardSize+permitMove);
  for (let j = iStart; j < (iStart+boardSize*permitMove); j=j+boardSize) {
    for (let i = j; i < (j+permitMove+1); i++) {
    permitZoneArr.push[i];
    }
  }
  return permitZoneArr;
}
