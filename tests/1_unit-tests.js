const chai = require('chai');
const assert = chai.assert;
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');
const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();
const puzzle = puzzlesAndSolutions[0][0];
const solution = puzzlesAndSolutions[0][1];

suite('Unit Tests', () => {
  test('Logic handles a valid puzzle string of 81 characters', function() {
    assert.equal(solver.validate(puzzle), '');
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function() {
    assert.equal(solver.validate('abcd1234'), 'Invalid characters in puzzle');
  });

  test('Logic handles a puzzle string that is not 81 characters in length', function() {
    assert.equal(solver.validate(puzzle + '1.2..'), 'Expected puzzle to be 81 characters long');
  });

  test('Logic handles a valid row placement', function() {
    assert.equal(solver.checkRowPlacement(puzzle, 0, 1, 3), true);
  });

  test('Logic handles an invalid row placement', function() {
    assert.equal(solver.checkRowPlacement(puzzle, 1, 2, 1), false);
  });

  test('Logic handles a valid column placement', function() {
    assert.equal(solver.checkColPlacement(puzzle, 1, 2, 3), true);
  });

  test('Logic handles an invalid column placement', function() {
    assert.equal(solver.checkColPlacement(puzzle, 1, 2, 1), false);
  });

  test('Logic handles a valid region (3x3 grid) placement', function() {
    assert.equal(solver.checkRegionPlacement(puzzle, 1, 2, 3), true);
  });

  test('Logic handles an invalid region (3x3 grid) placement', function() {
    assert.equal(solver.checkRegionPlacement(puzzle, 1, 2, 1), false);
  });

  test('Valid puzzle strings pass the solver', function() {
    assert.equal(solver.solve(puzzle), solution);
  });

  test('Invalid puzzle strings fail the solver', function() {
    assert.equal(solver.solve(puzzle.slice(0, -5) + '99999'), null);
  });

  test('Solver returns the expected solution for an incomplete puzzle', function() {
    assert.equal(solver.solve(puzzle), solution);
  });

});
