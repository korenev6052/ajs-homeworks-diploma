const loadMock = {
  theme: 'prairie',
  round: 1,
  user: {
    player: 'user',
    points: 25
  },
  engine: {
    player: 'engine',
    points: 75
  },
  positionedCharacters: [{
    character: {
      type: 'bowman',
      level: 1,
      attack: 25,
      defence: 25,
      health: 100,
      maxHealth: 100,
      moveRadius: 2,
      attackRadius: 2
    },
    position: 16,
    player: 'user'
  }, {
    character: {
      type: 'swordsman',
      level: 1,
      attack: 40,
      defence: 10,
      health: 100,
      maxHealth: 100,
      moveRadius: 4,
      attackRadius: 1
    },
    position: 17,
    player: 'user'
  }, {
    character: {
      type: 'undead',
      level: 1,
      attack: 25,
      defence: 25,
      health: 100,
      maxHealth: 100,
      moveRadius: 4,
      attackRadius: 1
    },
    position: 23,
    player: 'engine'
  }, {
    character: {
      type: 'vampire',
      level: 1,
      attack: 40,
      defence: 10,
      health: 100,
      maxHealth: 100,
      moveRadius: 2,
      attackRadius: 2
    },
    position: 30,
    player: 'engine'
  }],
  activePlayer: 'user',
  statistics: null
}

export default loadMock;