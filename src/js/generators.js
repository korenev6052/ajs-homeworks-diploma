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
    const randomType = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
    const randomLevel = Math.round(Math.random() * (maxLevel - 1) + 1);
    yield new randomType(randomLevel);
  }
}

export function generateTeam(allowedTypes, maxLevel, charactersCount) {
  const generator = characterGenerator(allowedTypes, maxLevel);
  const team = [];
  for (let i = 0; i < charactersCount; i += 1) {
    team.push(generator.next().value);
  }
  return team;
}

export function generatePositions(teamNumber, charactersCount, boardSize) {
  if (teamNumber !== 1 && teamNumber !== 2) {
    throw new Error('Invalid team number');
  }

  const allowedPositions = [];
  const n = Math.pow(boardSize, 2);
  let i = (teamNumber === 1) ? 0 : boardSize - 2;

  for (i; i < n; i += boardSize) {
    allowedPositions.push(i);
    allowedPositions.push(i + 1);
  }

  const positions = shuffle(allowedPositions).slice(0, charactersCount);
  return positions;
}

export function generatePositionedCharacters(team1, team2, boardSize) {
  const positions1 = generatePositions(1, team1.livingCharactersCount, boardSize);
  const positionedCharacters1 = team1.characters.map((character, i) => {
    return new PositionedCharacter(character, positions1[i]);
  });

  const positions2 = generatePositions(2, team2.livingCharactersCount, boardSize);
  const positionedCharacters2 = team2.characters.map((character, i) => {
    return new PositionedCharacter(character, positions2[i]);
  });

  return positionedCharacters1.concat(positionedCharacters2);
}
