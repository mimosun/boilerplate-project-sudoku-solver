'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      if (!req.body.puzzle || !req.body.coordinate || !req.body.value) {
        res.json({ error: 'Required field(s) missing' });
        return;
      }

      let inValidText = solver.validate(req.body.puzzle);

      if (inValidText) {
        res.json({ error: inValidText });
        return;
      }

      let coordinate = solver.parseCoordinate(req.body.coordinate);
      if (!coordinate) {
        res.json({ error: 'Invalid coordinate' });
        return;
      }

      let value = req.body.value;
      if (isNaN(value) || value < 1 || value > 9) {
        res.json({ error: 'Invalid value' });
        return;
      }
      
      const result = {
        valid: true
      };

      let conflict = solver.getConflict(req.body.puzzle, coordinate.row, coordinate.col, value);

      if (conflict.length) {
        result.conflict = conflict;
        result.valid = false;
      }

      return res.json(result);
    });

  app.route('/api/solve')
    .post((req, res) => {
      if (!req.body.puzzle) {
        res.json({ error: 'Required field missing' });
        return;
      }

      let inValidText = solver.validate(req.body.puzzle);

      if (inValidText) {
        res.json({ error: inValidText });
        return;
      }

      const solution = solver.solve(req.body.puzzle);

      if (!solution) {
        res.json({ error: 'Puzzle cannot be solved' });
        return;
      }

      return res.json({
        solution: solution
      });
    });
};
