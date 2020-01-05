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
