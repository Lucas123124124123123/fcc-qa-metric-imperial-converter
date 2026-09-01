const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function () {
  suite('Leitura da entrada', function () {
    test('numero inteiro', function () {
      assert.equal(convertHandler.getNum('32L'), 32);
    });

    test('numero decimal', function () {
      assert.equal(convertHandler.getNum('3.2L'), 3.2);
    });

    test('fracao', function () {
      assert.equal(convertHandler.getNum('1/2L'), 0.5);
    });

    test('fracao com decimal', function () {
      assert.equal(convertHandler.getNum('2.5/5L'), 0.5);
    });

    test('fracao dupla devolve erro', function () {
      assert.equal(convertHandler.getNum('3/2/3L'), 'invalid number');
    });

    test('sem numero assume 1', function () {
      assert.equal(convertHandler.getNum('kg'), 1);
    });
  });

  suite('Unidades', function () {
    test('todas as unidades validas', function () {
      const entradas = [
        'gal', 'l', 'mi', 'km', 'lbs', 'kg',
        'GAL', 'L', 'MI', 'KM', 'LBS', 'KG'
      ];
      const esperadas = [
        'gal', 'L', 'mi', 'km', 'lbs', 'kg',
        'gal', 'L', 'mi', 'km', 'lbs', 'kg'
      ];
      entradas.forEach((entrada, i) => {
        assert.equal(convertHandler.getUnit('1' + entrada), esperadas[i]);
      });
    });

    test('unidade invalida devolve erro', function () {
      assert.equal(convertHandler.getUnit('32g'), 'invalid unit');
    });

    test('unidade de retorno correta para cada unidade valida', function () {
      const entradas = ['gal', 'L', 'mi', 'km', 'lbs', 'kg'];
      const esperadas = ['L', 'gal', 'km', 'mi', 'kg', 'lbs'];
      entradas.forEach((entrada, i) => {
        assert.equal(convertHandler.getReturnUnit(entrada), esperadas[i]);
      });
    });

    test('nome por extenso de cada unidade', function () {
      const entradas = ['gal', 'L', 'mi', 'km', 'lbs', 'kg'];
      const esperadas = [
        'gallons', 'liters', 'miles', 'kilometers', 'pounds', 'kilograms'
      ];
      entradas.forEach((entrada, i) => {
        assert.equal(convertHandler.spellOutUnit(entrada), esperadas[i]);
      });
    });
  });

  suite('Conversoes', function () {
    test('gal para L', function () {
      assert.approximately(convertHandler.convert(1, 'gal'), 3.78541, 0.00001);
    });

    test('L para gal', function () {
      assert.approximately(convertHandler.convert(1, 'L'), 0.26417, 0.00001);
    });

    test('mi para km', function () {
      assert.approximately(convertHandler.convert(1, 'mi'), 1.60934, 0.00001);
    });

    test('km para mi', function () {
      assert.approximately(convertHandler.convert(1, 'km'), 0.62137, 0.00001);
    });

    test('lbs para kg', function () {
      assert.approximately(convertHandler.convert(1, 'lbs'), 0.45359, 0.00001);
    });

    test('kg para lbs', function () {
      assert.approximately(convertHandler.convert(1, 'kg'), 2.20462, 0.00001);
    });
  });
});
