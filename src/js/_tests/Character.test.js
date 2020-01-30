import Character, {
  Bowman, Swordsman, Daemon, Magician, Undead, Vampire,
} from '../Character';
import emoji from '../emoji';

test('Create new Character()', () => {
  expect(() => new Character(1)).toThrow('User use <new Character()>');
});

test('Create new Bowman()', () => {
  const bowman = new Bowman(1);
  expect(bowman).toEqual({
    type: 'bowman',
    level: 1,
    attack: 25,
    defence: 25,
    health: 100,
    maxHealth: 100,
    moveRadius: 2,
    attackRadius: 2,
  });
});

test('Create new Daemon()', () => {
  const daemon = new Daemon(1);
  expect(daemon).toEqual({
    type: 'daemon',
    level: 1,
    attack: 10,
    defence: 40,
    health: 100,
    maxHealth: 100,
    moveRadius: 1,
    attackRadius: 4,
  });
});

test('Create new Magician()', () => {
  const magician = new Magician(1);
  expect(magician).toEqual({
    type: 'magician',
    level: 1,
    attack: 10,
    defence: 40,
    health: 100,
    maxHealth: 100,
    moveRadius: 1,
    attackRadius: 4,
  });
});

test('Create new Swordsman()', () => {
  const swordsman = new Swordsman(1);
  expect(swordsman).toEqual({
    type: 'swordsman',
    level: 1,
    attack: 40,
    defence: 10,
    health: 100,
    maxHealth: 100,
    moveRadius: 4,
    attackRadius: 1,
  });
});

test('Create new Undead()', () => {
  const undead = new Undead(1);
  expect(undead).toEqual({
    type: 'undead',
    level: 1,
    attack: 25,
    defence: 25,
    health: 100,
    maxHealth: 100,
    moveRadius: 4,
    attackRadius: 1,
  });
});

test('Create new Vampire()', () => {
  const vampire = new Vampire(1);
  expect(vampire).toEqual({
    type: 'vampire',
    level: 1,
    attack: 40,
    defence: 10,
    health: 100,
    maxHealth: 100,
    moveRadius: 2,
    attackRadius: 2,
  });
});

test('Get character message', () => {
  const bowman = new Bowman(1);
  expect(bowman.message).toBe(`${emoji.medal} 1 ${emoji.swords} 25 ${emoji.shield} 25 ${emoji.heart} 100`);
});
