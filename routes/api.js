'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      const validateResult = solver.validate(puzzle);
      if (!validateResult.valid) {
        return res.json({ error: validateResult.error });
      }

      const match = coordinate.match(/^([A-I])([1-9])$/i);
      if (!match) {
        return res.json({ error: 'Invalid coordinate' });
      }

      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      const row = match[1].toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
      const col = parseInt(match[2]) - 1;

      const currentChar = puzzle[row * 9 + col];
      const tempPuzzle = puzzle.split('');
      tempPuzzle[row * 9 + col] = '.';

      const conflicts = [];

      if (!solver.checkRowPlacement(tempPuzzle.join(''), row, col, value)) {
        conflicts.push('row');
      }
      if (!solver.checkColPlacement(tempPuzzle.join(''), row, col, value)) {
        conflicts.push('column');
      }
      if (!solver.checkRegionPlacement(tempPuzzle.join(''), row, col, value)) {
        conflicts.push('region');
      }

      if (conflicts.length > 0) {
        return res.json({ valid: false, conflict: conflicts });
      }

      return res.json({ valid: true });
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      const validateResult = solver.validate(puzzle);
      if (!validateResult.valid) {
        return res.json({ error: validateResult.error });
      }

      const solution = solver.solve(puzzle);
      if (!solution) {
        return res.json({ error: 'Puzzle cannot be solved' });
      }

      return res.json({ solution });
    });
};
