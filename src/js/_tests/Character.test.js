import Character, { Bowman, Swordsman, Daemon, Magician, Undead, Vampire } from '../Character';

test('Character()', () => {
  expect(() => new Character(1)).toThrow('User use <new Character()>');
});

test('Character() inheritors', () => {
  const bowman = new Bowman(1);
  const swordsman = new Swordsman(1);
  const daemon = new Daemon(1);
  const magician = new Magician(1);
  const undead = new Undead(1);
  const vampire = new Vampire(1);

  expect.assertions(6);
  expect(bowman).toEqual({ attack: 25, defence: 25, health: 100, level: 1, type: "Bowman" });
  expect(swordsman).toEqual({ attack: 40, defence: 10, health: 100, level: 1, type: "Swordsman" });
  expect(daemon).toEqual({ attack: 10, defence: 40, health: 100, level: 1, type: "Daemon" });
  expect(magician).toEqual({ attack: 10, defence: 40, health: 100, level: 1, type: "Magician" });
  expect(undead).toEqual({ attack: 25, defence: 25, health: 100, level: 1, type: "Undead" });
  expect(vampire).toEqual({ attack: 40, defence: 10, health: 100, level: 1, type: "Vampire" });
});