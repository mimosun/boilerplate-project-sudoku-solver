const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  const requester = chai.request(server).keepOpen();
  const puzzle = puzzlesAndSolutions[0][0];
  const solution = puzzlesAndSolutions[0][1];

  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function(done) {
    requester.post('/api/solve')
      .send({ puzzle: puzzle })
      .end((err, res) => {
        assert.equal(res.body.solution, solution);
        done();
      });
  });

  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function(done) {
    requester.post('/api/solve')
      .send({})
      .end((err, res) => {
        assert.equal(res.body.error, 'Required field missing');
        done();
      });
  });

  test('Solve a puzzle with invalid characters: POST request to /api/solve', function(done) {
    requester.post('/api/solve')
      .send({ puzzle: 'abcdef123' })
      .end((err, res) => {
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });

  test('Solve a puzzle with incorrect length: POST request to /api/solve', function(done) {
    requester.post('/api/solve')
      .send({ puzzle: '1..3.4..' })
      .end((err, res) => {
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });

  test('Solve a puzzle that cannot be solved: POST request to /api/solve', function(done) {
    requester.post('/api/solve')
      .send({ puzzle: puzzle.slice(0, -5) + '99999' })
      .end((err, res) => {
        assert.equal(res.body.error, 'Puzzle cannot be solved');
        done();
      });
  });

  test('Check a puzzle placement with all fields: POST request to /api/check', function(done) {
    requester.post('/api/check')
      .send({ puzzle: puzzle, coordinate: 'A1', value: 1 })
      .end((err, res) => {
        assert.isOk(res.body.valid);
        done();
      });
  });

  test('Check a puzzle placement with single placement conflict: POST request to /api/check', function(done) {
    requester.post('/api/check')
      .send({ puzzle: puzzle, coordinate: 'A2', value: 1 })
      .end((err, res) => {
        assert.isNotOk(res.body.valid);
        done();
      });
  });

  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function(done) {
    requester.post('/api/check')
      .send({ puzzle: puzzle, coordinate: 'A2', value: 1 })
      .end((err, res) => {
        assert.isNotOk(res.body.valid);
        done();
      });
  });
  
  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function(done) {
    requester.post('/api/check')
      .send({ puzzle: puzzle, coordinate: 'A2', value: 1 })
      .end((err, res) => {
        assert.isNotOk(res.body.valid);
        done();
      });
  });
  
  test('Check a puzzle placement with missing required fields: POST request to /api/check', function(done) {
    requester.post('/api/check')
      .send({ puzzle: puzzle })
      .end((err, res) => {
        assert.equal(res.body.error, 'Required field(s) missing');
        done();
      });
  });

  test('Check a puzzle placement with invalid characters: POST request to /api/check', function(done) {
    requester.post('/api/check')
      .send({ puzzle: 'abcdef123', coordinate: 'A2', value: 1 })
      .end((err, res) => {
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });

  test('Check a puzzle placement with incorrect length: POST request to /api/check', function(done) {
    requester.post('/api/check')
      .send({ puzzle: '1..3.4..', coordinate: 'A2', value: 1 })
      .end((err, res) => {
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });

  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function(done) {
    requester.post('/api/check')
      .send({ puzzle: puzzle, coordinate: 'A12', value: 1 })
      .end((err, res) => {
        assert.equal(res.body.error, 'Invalid coordinate');
        done();
      });
  });

  test('Check a puzzle placement with invalid placement value: POST request to /api/check', function(done) {
    requester.post('/api/check')
      .send({ puzzle: puzzle, coordinate: 'A2', value: 12 })
      .end((err, res) => {
        assert.equal(res.body.error, 'Invalid value');
        done();
      });
  });
});
