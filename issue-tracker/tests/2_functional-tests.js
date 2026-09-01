const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const PROJECT = 'testes-apitracker';
let idCriado;

suite('Functional Tests', function () {
  this.timeout(5000);

  suite('POST /api/issues/{project}', function () {
    test('1. cria issue com todos os campos', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/' + PROJECT)
        .send({
          issue_title: 'Titulo completo',
          issue_text: 'Texto da issue',
          created_by: 'Lucas',
          assigned_to: 'Alguem',
          status_text: 'Em analise'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Titulo completo');
          assert.equal(res.body.issue_text, 'Texto da issue');
          assert.equal(res.body.created_by, 'Lucas');
          assert.equal(res.body.assigned_to, 'Alguem');
          assert.equal(res.body.status_text, 'Em analise');
          assert.isTrue(res.body.open);
          assert.property(res.body, '_id');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          idCriado = res.body._id;
          done();
        });
    });

    test('2. cria issue so com os campos obrigatorios', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/' + PROJECT)
        .send({
          issue_title: 'So obrigatorios',
          issue_text: 'Texto',
          created_by: 'Lucas'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.assigned_to, '');
          assert.equal(res.body.status_text, '');
          done();
        });
    });

    test('3. cria issue faltando campo obrigatorio', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/' + PROJECT)
        .send({ issue_title: 'Sem texto' })
        .end(function (err, res) {
          assert.equal(res.body.error, 'required field(s) missing');
          done();
        });
    });
  });

  suite('GET /api/issues/{project}', function () {
    test('4. lista as issues do projeto', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/' + PROJECT)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], '_id');
          done();
        });
    });

    test('5. lista com um filtro', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/' + PROJECT + '?created_by=Lucas')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          res.body.forEach(issue => assert.equal(issue.created_by, 'Lucas'));
          done();
        });
    });

    test('6. lista com varios filtros', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/' + PROJECT + '?created_by=Lucas&open=true')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          res.body.forEach(issue => {
            assert.equal(issue.created_by, 'Lucas');
            assert.isTrue(issue.open);
          });
          done();
        });
    });
  });

  suite('PUT /api/issues/{project}', function () {
    test('7. atualiza um campo', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/' + PROJECT)
        .send({ _id: idCriado, issue_text: 'Texto atualizado' })
        .end(function (err, res) {
          assert.equal(res.body.result, 'successfully updated');
          assert.equal(res.body._id, idCriado);
          done();
        });
    });

    test('8. atualiza varios campos', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/' + PROJECT)
        .send({
          _id: idCriado,
          issue_title: 'Novo titulo',
          issue_text: 'Novo texto'
        })
        .end(function (err, res) {
          assert.equal(res.body.result, 'successfully updated');
          assert.equal(res.body._id, idCriado);
          done();
        });
    });

    test('9. atualiza sem _id', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/' + PROJECT)
        .send({ issue_text: 'Sem id' })
        .end(function (err, res) {
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });

    test('10. atualiza sem campos para alterar', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/' + PROJECT)
        .send({ _id: idCriado })
        .end(function (err, res) {
          assert.equal(res.body.error, 'no update field(s) sent');
          assert.equal(res.body._id, idCriado);
          done();
        });
    });

    test('11. atualiza com _id invalido', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/' + PROJECT)
        .send({ _id: 'id-que-nao-existe', issue_text: 'Texto' })
        .end(function (err, res) {
          assert.equal(res.body.error, 'could not update');
          assert.equal(res.body._id, 'id-que-nao-existe');
          done();
        });
    });
  });

  suite('DELETE /api/issues/{project}', function () {
    test('12. apaga uma issue', function (done) {
      chai
        .request(server)
        .keepOpen()
        .delete('/api/issues/' + PROJECT)
        .send({ _id: idCriado })
        .end(function (err, res) {
          assert.equal(res.body.result, 'successfully deleted');
          assert.equal(res.body._id, idCriado);
          done();
        });
    });

    test('13. apaga com _id invalido', function (done) {
      chai
        .request(server)
        .keepOpen()
        .delete('/api/issues/' + PROJECT)
        .send({ _id: 'id-que-nao-existe' })
        .end(function (err, res) {
          assert.equal(res.body.error, 'could not delete');
          assert.equal(res.body._id, 'id-que-nao-existe');
          done();
        });
    });

    test('14. apaga sem _id', function (done) {
      chai
        .request(server)
        .keepOpen()
        .delete('/api/issues/' + PROJECT)
        .send({})
        .end(function (err, res) {
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });
  });
});
