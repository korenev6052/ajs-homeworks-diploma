/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */

export function* characterGenerator(allowedTypes, maxLevel) {
  while (true) {
    const randomType = allowedTypes[Math.floor(Math.random() * (allowedTypes.length - 1)) + 1];
    const randomLevel = Math.floor(Math.random() * (maxLevel - 1)) + 1;
    yield new randomType(randomLevel);
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const generator = characterGenerator(allowedTypes, maxLevel);
  const team = [];
  for (let i = 0; i < characterCount; i += 1) {
    team.push(generator.next().value);
  }
  return team;
}
