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
 * @param characterCount -количество персонажей в команде
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
/**
 * Формирует массив индексов поля, доступных для атаки выбранному персонажу
 * @param index - индекс выбранного персонажа
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @param possibilityAttack - количествот доступных клеток для атаки для данного персонажа
 * @returns массив индексов поля, доступных для атаки:
 * */
export function createAttackZoneArr (index, boardSize, possibilityAttack) {
  let attackZoneArr = [];
  let row = Math.trunc(index/boardSize);
  let column = index%boardSize;
  let iLeft = undefined;
  let iStart = undefined;
  let iFinish = undefined;
  let iRight = undefined;
  let iRightTop = undefined;
  let qColumn = undefined;
  if (column > possibilityAttack) {
    iLeft = index - possibilityAttack;
  } else {
    iLeft = index - column;
  }
  if ((boardSize-1-column) <= possibilityAttack) {
    iRight = index+boardSize-1-column;
  } else {
    iRight = index + possibilityAttack;
  }
  if (row > possibilityAttack) {
    iStart = iLeft - possibilityAttack*boardSize;
    iRightTop = iRight - possibilityAttack*boardSize;
    
  } else {
    iStart = iLeft - row*boardSize;
    iRightTop = iRight - row*boardSize;
  }

  qColumn = iRightTop - iStart;

  if ((boardSize-1-row) <= possibilityAttack) {
    iFinish = iRight + boardSize * (boardSize-1-row);
  } else {
    iFinish = iRight + possibilityAttack* boardSize;
  }

  for (let j = iStart; j < iFinish; j=j+boardSize) {
    for (let i = j; i < (j+qColumn+1); i++) {
     if (i != index) {
      attackZoneArr.push(i);
     }
    }
  }
  return attackZoneArr;
}
/**
 * Формирует массив индексов поля, доступных для перемещения выбранному персонажу
* @param index - индекс выбранного персонажа
* @param boardSize - размер квадратного поля (в длину или ширину)
* @param permitMove - количествот доступных для перемещения клеток для данного персонажа
* @returns массив индексов поля, доступных для перемещения:
* */
export function createPermitZoneArr (index, boardSize, permitMove) {
  let permitZoneArr = [];
  let row = Math.trunc(index/boardSize);
  let column = index%boardSize;
  let iLeft = undefined;
  let iRight = undefined;
  let iTop = undefined;
  let iBottom = undefined;
  let iLeftTop = undefined;
  let iLeftBottom = undefined;
  let iRightTop = undefined;
  let iRightBottom = undefined;
  if (column > permitMove) {
    iLeft = index - permitMove;
  } else {
    iLeft = index - column;
  }
  if ((boardSize-1-column) <= permitMove) {
    iRight = index+boardSize-1-column;
  } else {
    iRight = index + permitMove;
  }
  for (let i = iLeft; i < (iRight+1); i++) {
    if (i != index) {
      permitZoneArr.push(i);
     }
  }
  if (row > permitMove) {
    iTop = index - boardSize*permitMove;
  } else {
    iTop = index - boardSize*row;
  }
  if ((boardSize-1-row) <= permitMove) {
    iBottom = index + boardSize*(boardSize-1-row);
  } else {
    iBottom = index + boardSize*permitMove;
  }
  for (let i = iTop; i < (iBottom+1); i+=boardSize) {
    if (i != index) {
      permitZoneArr.push(i);
     }
  }
  iLeftTop = index - (boardSize+1)* Math.min(column,row,permitMove);
  iLeftBottom = index + (boardSize-1) * Math.min(column, (boardSize-1-row), permitMove);
  iRightTop = index - (boardSize-1)*Math.min(row, (boardSize-1-column), permitMove);
  iRightBottom = index + (boardSize+1) * Math.min((boardSize-1-row),(boardSize-1-column), permitMove);
  for (let i = iLeftTop; i < (iRightBottom+1); i+=(boardSize+1)) {
    if (i != index) {
      permitZoneArr.push(i);
     }
  }
  for (let i = iRightTop; i < (iLeftBottom+1); i+=(boardSize-1)) {
    if (i != index) {
      permitZoneArr.push(i);
     }
  }
  return permitZoneArr;
}

