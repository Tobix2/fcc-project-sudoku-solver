const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9....6..3.8...1.4.5..2.8.9...';
const solvedPuzzle = '135762984946381257728459613694517832812936745357824196489673521571248369263195478';

suite('Functional Tests', () => {

  suite('POST /api/solve', () => {
  test('Puzzle field is empty', (done) => {
  chai.request(server)
    .post('/api/solve')
    .send({ puzzle: '' })
    .end((err, res) => {
      assert.equal(res.status, 200);
      assert.deepEqual(res.body, { error: 'Required field missing' });
      done();
    });
});

    test('Missing puzzle string', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Required field missing' });
          done();
        });
    });

    test('Invalid characters in puzzle', (done) => {
      const invalid = validPuzzle.replace('.', 'x');
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: invalid })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
          done();
        });
    });

    test('Puzzle with incorrect length', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: validPuzzle.slice(0, 80) })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
          done();
        });
    });

    test('Unsolvable puzzle', (done) => {
      const broken = validPuzzle.replace('1', '9');
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: broken })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' });
          done();
        });
    });
  });

  suite('POST /api/check', () => {
    test('Valid placement', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'A2', value: '3' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { valid: true });
          done();
        });
    });

    test('Single conflict', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'A2', value: '1' }) // 1 is already in row
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.include(res.body.conflict, 'row');
          done();
        });
    });

    test('Multiple conflicts', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'A2', value: '5' }) // row + region
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.includeMembers(res.body.conflict, ['row', 'region']);
          done();
        });
    });

    test('All conflicts', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'A2', value: '2' }) // row + column + region
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.sameMembers(res.body.conflict, ['row', 'column', 'region']);
          done();
        });
    });

    test('Missing fields', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, value: '2' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Required field(s) missing' });
          done();
        });
    });

    test('Invalid coordinate', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'Z9', value: '2' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Invalid coordinate' });
          done();
        });
    });

    test('Invalid value', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'A2', value: 'x' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Invalid value' });
          done();
        });
    });

        test('Puzzle with invalid characters (in /api/check)', (done) => {
      const invalidPuzzle = validPuzzle.replace('.', 'x');
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: invalidPuzzle, coordinate: 'A2', value: '3' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
          done();
        });
    });

    test('Puzzle with incorrect length (in /api/check)', (done) => {
      const shortPuzzle = validPuzzle.slice(0, 80);
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: shortPuzzle, coordinate: 'A2', value: '3' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
          done();
        });
    });





  });
});
