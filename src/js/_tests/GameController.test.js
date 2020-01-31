import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';
import GameController from '../GameController';
import loadMock from './mock-consts';

document.body.innerHTML = '<div id="game-container"></div>';

const gamePlay = new GamePlay();
gamePlay.bindToDOM(document.querySelector('#game-container'));

const stateService = new GameStateService(localStorage);

const gameCtrl = new GameController(gamePlay, stateService);
gameCtrl.init();

jest.mock('../GameStateService');

test('Load game successfully', () => {
  gameCtrl.stateService.load.mockReturnValue(loadMock);
  expect(gameCtrl.onLoadGame()).toBe(true);
});

test('Load game failed', () => {
  gameCtrl.stateService.load.mockImplementation(() => {
    Error('Invalid state');
  });
  expect(gameCtrl.onLoadGame()).toBe(false);
});
