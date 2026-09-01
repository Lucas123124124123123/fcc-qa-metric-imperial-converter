const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let idValido;
const idInexistente = '000000000000000000000000';

suite('Functional Tests', function () {
  this.timeout(5000);

  suiteSetup(function (done) {
    chai
      .request(server)
      .post('/api/books')
      .send({ title: 'Livro base' })
      .end(function () {
        done();
      });
  });

  /*
   * ----[EXAMPLE TEST]----
   */
  test('#example Test GET /api/books', function (done) {
    chai
      .request(server)
      .get('/api/books')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite('Routing tests', function () {
    suite('POST /api/books com titulo => objeto do livro', function () {
      test('1. POST /api/books com titulo', function (done) {
        chai
          .request(server)
          .post('/api/books')
          .send({ title: 'O Hobbit' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, '_id');
            assert.equal(res.body.title, 'O Hobbit');
            idValido = res.body._id;
            done();
          });
      });

      test('2. POST /api/books sem titulo', function (done) {
        chai
          .request(server)
          .post('/api/books')
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title');
            done();
          });
      });
    });

    suite('GET /api/books => array de livros', function () {
      test('3. GET /api/books', function (done) {
        chai
          .request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'commentcount');
            assert.property(res.body[0], 'title');
            assert.property(res.body[0], '_id');
            done();
          });
      });
    });

    suite('GET /api/books/[id] => livro unico', function () {
      test('4. GET /api/books/[id] com id inexistente', function (done) {
        chai
          .request(server)
          .get('/api/books/' + idInexistente)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

      test('5. GET /api/books/[id] com id valido', function (done) {
        chai
          .request(server)
          .get('/api/books/' + idValido)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, idValido);
            assert.equal(res.body.title, 'O Hobbit');
            assert.isArray(res.body.comments);
            done();
          });
      });
    });

    suite('POST /api/books/[id] => adiciona comentario', function () {
      test('6. POST /api/books/[id] com comentario', function (done) {
        chai
          .request(server)
          .post('/api/books/' + idValido)
          .send({ comment: 'Muito bom' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, idValido);
            assert.include(res.body.comments, 'Muito bom');
            done();
          });
      });

      test('7. POST /api/books/[id] sem comentario', function (done) {
        chai
          .request(server)
          .post('/api/books/' + idValido)
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field comment');
            done();
          });
      });

      test('8. POST /api/books/[id] com id inexistente', function (done) {
        chai
          .request(server)
          .post('/api/books/' + idInexistente)
          .send({ comment: 'Comentario' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
    });

    suite('DELETE /api/books/[id] => apaga livro', function () {
      test('9. DELETE /api/books/[id] com id valido', function (done) {
        chai
          .request(server)
          .delete('/api/books/' + idValido)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful');
            done();
          });
      });

      test('10. DELETE /api/books/[id] com id inexistente', function (done) {
        chai
          .request(server)
          .delete('/api/books/' + idInexistente)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
    });
  });
});
