'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route('/api/check').post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    if (!puzzle || !coordinate || !value) {
      return res.json({ error: 'Required field(s) missing' });
    }

    const puzzleError = solver.validate(puzzle);
    if (puzzleError) return res.json({ error: puzzleError });

    if (!/^[A-Ia-i][1-9]$/.test(coordinate)) {
      return res.json({ error: 'Invalid coordinate' });
    }

    if (!/^[1-9]$/.test(String(value))) {
      return res.json({ error: 'Invalid value' });
    }

    const row = solver.letterToRow(coordinate[0]);
    const column = Number(coordinate[1]) - 1;

    if (puzzle[row * 9 + column] === String(value)) {
      return res.json({ valid: true });
    }

    const conflict = [];
    if (!solver.checkRowPlacement(puzzle, row, column, value)) {
      conflict.push('row');
    }
    if (!solver.checkColPlacement(puzzle, row, column, value)) {
      conflict.push('column');
    }
    if (!solver.checkRegionPlacement(puzzle, row, column, value)) {
      conflict.push('region');
    }

    if (conflict.length === 0) return res.json({ valid: true });
    return res.json({ valid: false, conflict });
  });

  app.route('/api/solve').post((req, res) => {
    const { puzzle } = req.body;

    if (!puzzle) return res.json({ error: 'Required field missing' });

    const puzzleError = solver.validate(puzzle);
    if (puzzleError) return res.json({ error: puzzleError });

    const solution = solver.solve(puzzle);
    if (!solution) return res.json({ error: 'Puzzle cannot be solved' });

    return res.json({ solution });
  });
};
