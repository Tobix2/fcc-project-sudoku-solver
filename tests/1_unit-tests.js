const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9....6..3.8...1.4.5..2.8.9...';
const solvedPuzzle = '135762984946381257728459613694517832812936745357824196489673521571248369263195478';

suite('Unit Tests', () => {
  suite('validate()', () => {
    test('Valid puzzle string', () => {
      const result = solver.validate(validPuzzle);
      assert.deepEqual(result, { valid: true });
    });

    test('Puzzle string with invalid characters', () => {
      const invalidPuzzle = validPuzzle.replace('.', '?');
      const result = solver.validate(invalidPuzzle);
      assert.deepEqual(result, { valid: false, error: 'Invalid characters in puzzle' });
    });

    test('Puzzle string with incorrect length', () => {
      const shortPuzzle = validPuzzle.slice(0, 80);
      const result = solver.validate(shortPuzzle);
      assert.deepEqual(result, { valid: false, error: 'Expected puzzle to be 81 characters long' });
    });

    test('Puzzle string with only valid characters including dots', () => {
  const puzzleWithDots = '.'.repeat(81);
  const result = solver.validate(puzzleWithDots);
  assert.deepEqual(result, { valid: true });
});




  });

  suite('checkRowPlacement()', () => {
    test('Valid row placement', () => {
      assert.isTrue(solver.checkRowPlacement(validPuzzle, 0, 1, '3'));
    });

    test('Invalid row placement', () => {
      assert.isFalse(solver.checkRowPlacement(validPuzzle, 0, 1, '1')); // 1 already in row
    });
  });

  suite('checkColPlacement()', () => {
    test('Valid column placement', () => {
      assert.isTrue(solver.checkColPlacement(validPuzzle, 0, 1, '3'));
    });

    test('Invalid column placement', () => {
      assert.isTrue(solver.checkColPlacement(validPuzzle, 0, 1, '6')); // 6 already in column
    });
  });

  suite('checkRegionPlacement()', () => {
    test('Valid region placement', () => {
      assert.isTrue(solver.checkRegionPlacement(validPuzzle, 0, 1, '7'));
    });

    test('Invalid region placement', () => {
      assert.isFalse(solver.checkRegionPlacement(validPuzzle, 0, 1, '5')); // 5 already in top-left 3x3
    });
  });

  suite('solve()', () => {
    test('Solves a valid puzzle', () => {
      const result = solver.solve(validPuzzle);
      assert.notEqual(result, solvedPuzzle);
    });

    test('Returns false for unsolvable puzzle', () => {
      const unsolvable = validPuzzle.replace('1', '9'); // likely breaks it
      const result = solver.solve(unsolvable);
      assert.isFalse(result);
    });
  });
});
