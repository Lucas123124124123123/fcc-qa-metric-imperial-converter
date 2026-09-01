const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  test('1. texto e locale validos: POST /api/translate', done => {
    chai
      .request(server)
      .keepOpen()
      .post('/api/translate')
      .send({
        text: 'Mangoes are my favorite fruit.',
        locale: 'american-to-british'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.text, 'Mangoes are my favorite fruit.');
        assert.equal(
          res.body.translation,
          'Mangoes are my <span class="highlight">favourite</span> fruit.'
        );
        done();
      });
  });

  test('2. locale invalido: POST /api/translate', done => {
    chai
      .request(server)
      .keepOpen()
      .post('/api/translate')
      .send({
        text: 'Mangoes are my favorite fruit.',
        locale: 'american-to-klingon'
      })
      .end((err, res) => {
        assert.equal(res.body.error, 'Invalid value for locale field');
        done();
      });
  });

  test('3. campo text ausente: POST /api/translate', done => {
    chai
      .request(server)
      .keepOpen()
      .post('/api/translate')
      .send({ locale: 'american-to-british' })
      .end((err, res) => {
        assert.equal(res.body.error, 'Required field(s) missing');
        done();
      });
  });

  test('4. campo locale ausente: POST /api/translate', done => {
    chai
      .request(server)
      .keepOpen()
      .post('/api/translate')
      .send({ text: 'Mangoes are my favorite fruit.' })
      .end((err, res) => {
        assert.equal(res.body.error, 'Required field(s) missing');
        done();
      });
  });

  test('5. texto vazio: POST /api/translate', done => {
    chai
      .request(server)
      .keepOpen()
      .post('/api/translate')
      .send({ text: '', locale: 'american-to-british' })
      .end((err, res) => {
        assert.equal(res.body.error, 'No text to translate');
        done();
      });
  });

  test('6. texto que nao precisa de traducao: POST /api/translate', done => {
    chai
      .request(server)
      .keepOpen()
      .post('/api/translate')
      .send({ text: 'Hello world', locale: 'american-to-british' })
      .end((err, res) => {
        assert.equal(res.body.translation, 'Everything looks good to me!');
        done();
      });
  });
});
