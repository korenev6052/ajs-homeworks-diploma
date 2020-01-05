import { calcTileType } from '../utils';

test('calcTileType() => top-left', () => {
  expect(calcTileType(0, 4)).toBe('top-left');
});

test('calcTileType() => top-right', () => {
  expect(calcTileType(3, 4)).toBe('top-right');
});

test('calcTileType() => bottom-left', () => {
  expect(calcTileType(12, 4)).toBe('bottom-left');
});

test('calcTileType() => bottom-right', () => {
  expect(calcTileType(15, 4)).toBe('bottom-right');
});

test('calcTileType() => top', () => {
  expect.assertions(2);
  expect(calcTileType(1, 4)).toBe('top');
  expect(calcTileType(2, 4)).toBe('top');
});

test('calcTileType() => bottom', () => {
  expect.assertions(2);
  expect(calcTileType(13, 4)).toBe('bottom');
  expect(calcTileType(14, 4)).toBe('bottom');
});

test('calcTileType() => left', () => {
  expect.assertions(2);
  expect(calcTileType(4, 4)).toBe('left');
  expect(calcTileType(8, 4)).toBe('left');
});

test('calcTileType() => right', () => {
  expect.assertions(2);
  expect(calcTileType(7, 4)).toBe('right');
  expect(calcTileType(11, 4)).toBe('right');
});

test('calcTileType() => center', () => {
  expect.assertions(4);
  expect(calcTileType(5, 4)).toBe('center');
  expect(calcTileType(6, 4)).toBe('center');
  expect(calcTileType(9, 4)).toBe('center');
  expect(calcTileType(10, 4)).toBe('center');
});