export function calcTileType(index, boardSize) {
  const topLeft = 0;
  const topRight = boardSize - 1;
  const bottomLeft = boardSize * (boardSize - 1);
  const bottomRight = Math.pow(boardSize, 2) - 1;

  if (index === topLeft) return 'top-left';
  if (index === topRight) return 'top-right';
  if (index === bottomLeft) return 'bottom-left';
  if (index === bottomRight) return 'bottom-right';
  if (index > topLeft && index < topRight) return 'top';
  if (index > bottomLeft && index < bottomRight) return 'bottom';
  if (index % boardSize === 0) return 'left';
  if ((index + 1) % boardSize === 0) return 'right';

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

export function shuffle(arr) {
  let j, temp;
  for (let i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
}

export function calcActionPositions(position, radius, boardSize) {
  const board = [];
  for (let i = 0; i < boardSize; i += 1) {
    board[i] = [];
    for (let j = 0; j < boardSize; j += 1) {
      board[i][j] = i * boardSize + j;
    }
  }

  const I = (position < boardSize) ? 0 : Math.floor(position / boardSize);
  const J = (position < boardSize) ? position : position % boardSize;

  const actionPositions = [];
  for (let R = 1; R <= radius; R += 1) {
    if ((I - R >= 0) && (J - R >= 0)) actionPositions.push(board[I - R][J - R]); // top-left
    if (I - R >= 0) actionPositions.push(board[I - R][J]); // top-center
    if ((I - R >= 0) && (J + R < boardSize)) actionPositions.push(board[I - R][J + R]); // top-right
    if (J - R >= 0) actionPositions.push(board[I][J - R]); // center-left
    if (J + R < boardSize) actionPositions.push(board[I][J + R]); // center-right
    if ((I + R < boardSize) && (J - R >= 0)) actionPositions.push(board[I + R][J - R]); // bottom-left
    if (I + R < boardSize) actionPositions.push(board[I + R][J]); // bottom-center
    if ((I + R < boardSize) && (J + R < boardSize)) actionPositions.push(board[I + R][J + R]); // bottom-right
  }

  return actionPositions;
}