import PositionedCharacter from './PositionedCharacter';
import { shuffle } from './utils';

/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */

export function* characterGenerator(allowedTypes, maxLevel) {
  while (true) {
    const RandomType = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
    const randomLevel = Math.round(Math.random() * (maxLevel - 1) + 1);
    yield new RandomType(randomLevel);
  }
}

export function generateCharacters(allowedTypes, maxLevel, charactersCount) {
  const generator = characterGenerator(allowedTypes, maxLevel);
  const team = [];
  for (let i = 0; i < charactersCount; i += 1) {
    team.push(generator.next().value);
  }
  return team;
}

export function generatePositions(boardSize, side, count) {
  if (side !== 'left' && side !== 'right') {
    throw new Error('Side must be <left> or <right>');
  }

  const allowedPositions = [];
  const n = boardSize ** 2;
  let i = (side === 'left') ? 0 : boardSize - 2;

  for (i; i < n; i += boardSize) {
    allowedPositions.push(i);
    allowedPositions.push(i + 1);
  }

  return shuffle(allowedPositions).slice(0, count);
}

export function generatePositionedCharacters(team1, team2, boardSize) {
  const positions1 = generatePositions(boardSize, 'left', team1.charactersCount);
  const positionedCharacters1 = team1.characters.map((character, i) => {
    const result = new PositionedCharacter(character, positions1[i], team1.player);
    return result;
  });

  const positions2 = generatePositions(boardSize, 'right', team2.charactersCount);
  const positionedCharacters2 = team2.characters.map((character, i) => {
    const result = new PositionedCharacter(character, positions2[i], team2.player);
    return result;
  });

  return positionedCharacters1.concat(positionedCharacters2);
}
