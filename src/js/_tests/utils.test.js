import { calcTileType, calcActionPositions } from '../utils';

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

test('calcActionPositions() position is top-left', () => {
  const expected = [1, 8, 9, 2, 16, 18, 3, 24, 27, 4, 32, 36];
  expect(calcActionPositions(0, 4, 8)).toEqual(expected);
});

test('calcActionPositions() position is top', () => {
  const expected = [2, 4, 10, 11, 12, 1, 5, 17, 19, 21, 0, 6, 24, 27, 30, 7, 35, 39];
  expect(calcActionPositions(3, 4, 8)).toEqual(expected);
});

test('calcActionPositions() position is top-right', () => {
  const expected = [6, 14, 15, 5, 21, 23];
  expect(calcActionPositions(7, 2, 8)).toEqual(expected);
});

test('calcActionPositions() position is left', () => {
  const expected = [16, 17, 25, 32, 33, 8, 10, 26, 40, 42];
  expect(calcActionPositions(24, 2, 8)).toEqual(expected);
});

test('calcActionPositions() position is center', () => {
  const expected = [35, 36, 37, 43, 45, 51, 52, 53, 26, 28, 30, 42, 46, 58, 60, 62, 17, 20, 23, 41, 47, 8, 12, 40];
  expect(calcActionPositions(44, 4, 8)).toEqual(expected);
});

test('calcActionPositions() position is right', () => {
  const expected = [46, 47, 54, 62, 63, 37, 39, 53];
  expect(calcActionPositions(55, 2, 8)).toEqual(expected);
});

test('calcActionPositions() position is bottom-left', () => {
  const expected = [48, 49, 57, 40, 42, 58];
  expect(calcActionPositions(56, 2, 8)).toEqual(expected);
});

test('calcActionPositions() position is bottom', () => {
  const expected = [51, 52, 53, 59, 61, 42, 44, 46, 58, 62, 33, 36, 39, 57, 63];
  expect(calcActionPositions(60, 3, 8)).toEqual(expected);
});

test('calcActionPositions() position is bottom-right', () => {
  const expected = [54, 55, 62, 45, 47, 61];
  expect(calcActionPositions(63, 2, 8)).toEqual(expected);
});
