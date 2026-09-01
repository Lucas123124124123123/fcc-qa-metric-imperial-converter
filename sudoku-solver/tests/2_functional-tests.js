const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const validPuzzle =
  '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
const validSolution =
  '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

suite('Functional Tests', () => {
  suite('POST /api/solve', () => {
    test('1. tabuleiro valido', done => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({ puzzle: validPuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.solution, validSolution);
          done();
        });
    });

    test('2. tabuleiro faltando', done => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({})
        .end((err, res) => {
          assert.equal(res.body.error, 'Required field missing');
          done();
        });
    });

    test('3. caracteres invalidos', done => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({ puzzle: validPuzzle.replace('.', 'X') })
        .end((err, res) => {
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });

    test('4. tamanho errado', done => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({ puzzle: validPuzzle.slice(0, 80) })
        .end((err, res) => {
          assert.equal(
            res.body.error,
            'Expected puzzle to be 81 characters long'
          );
          done();
        });
    });

    test('5. tabuleiro sem solucao', done => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({ puzzle: '9'.repeat(81) })
        .end((err, res) => {
          assert.equal(res.body.error, 'Puzzle cannot be solved');
          done();
        });
    });
  });

  suite('POST /api/check', () => {
    test('6. todos os campos preenchidos', done => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'A2', value: '3' })
        .end((err, res) => {
          assert.isTrue(res.body.valid);
          done();
        });
    });

    test('7. um conflito', done => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'A2', value: '4' })
        .end((err, res) => {
          assert.isFalse(res.body.valid);
          assert.deepEqual(res.body.conflict, ['row']);
          done();
        });
    });

    test('8. varios conflitos', done => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'A2', value: '6' })
        .end((err, res) => {
          assert.isFalse(res.body.valid);
          assert.deepEqual(res.body.conflict, ['column', 'region']);
          done();
        });
    });

    test('9. conflito em linha, coluna e regiao', done => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'A2', value: '2' })
        .end((err, res) => {
          assert.isFalse(res.body.valid);
          assert.deepEqual(res.body.conflict, ['row', 'column', 'region']);
          done();
        });
    });

    test('10. campos obrigatorios faltando', done => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: validPuzzle })
        .end((err, res) => {
          assert.equal(res.body.error, 'Required field(s) missing');
          done();
        });
    });

    test('11. caracteres invalidos no tabuleiro', done => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
          puzzle: validPuzzle.replace('.', 'X'),
          coordinate: 'A2',
          value: '3'
        })
        .end((err, res) => {
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });

    test('12. tabuleiro com tamanho errado', done => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
          puzzle: validPuzzle.slice(0, 80),
          coordinate: 'A2',
          value: '3'
        })
        .end((err, res) => {
          assert.equal(
            res.body.error,
            'Expected puzzle to be 81 characters long'
          );
          done();
        });
    });

    test('13. coordenada invalida', done => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'Z9', value: '3' })
        .end((err, res) => {
          assert.equal(res.body.error, 'Invalid coordinate');
          done();
        });
    });

    test('14. valor invalido', done => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'A2', value: '0' })
        .end((err, res) => {
          assert.equal(res.body.error, 'Invalid value');
          done();
        });
    });
  });
});
