const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

const validPuzzle =
  '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
const validSolution =
  '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

suite('Unit Tests', () => {
  test('1. aceita um tabuleiro valido de 81 caracteres', () => {
    assert.isNull(solver.validate(validPuzzle));
  });

  test('2. recusa tabuleiro com caracteres invalidos', () => {
    const comLetra = validPuzzle.replace('.', 'X');
    assert.equal(solver.validate(comLetra), 'Invalid characters in puzzle');
  });

  test('3. recusa tabuleiro que nao tem 81 caracteres', () => {
    assert.equal(
      solver.validate(validPuzzle.slice(0, 80)),
      'Expected puzzle to be 81 characters long'
    );
  });

  test('4. aceita colocacao valida na linha', () => {
    assert.isTrue(solver.checkRowPlacement(validPuzzle, 0, 1, '3'));
  });

  test('5. recusa colocacao invalida na linha', () => {
    assert.isFalse(solver.checkRowPlacement(validPuzzle, 0, 1, '5'));
  });

  test('6. aceita colocacao valida na coluna', () => {
    assert.isTrue(solver.checkColPlacement(validPuzzle, 0, 1, '3'));
  });

  test('7. recusa colocacao invalida na coluna', () => {
    assert.isFalse(solver.checkColPlacement(validPuzzle, 0, 1, '6'));
  });

  test('8. aceita colocacao valida na regiao 3x3', () => {
    assert.isTrue(solver.checkRegionPlacement(validPuzzle, 0, 1, '3'));
  });

  test('9. recusa colocacao invalida na regiao 3x3', () => {
    assert.isFalse(solver.checkRegionPlacement(validPuzzle, 0, 1, '5'));
  });

  test('10. tabuleiro valido passa pelo solucionador', () => {
    assert.isString(solver.solve(validPuzzle));
  });

  test('11. tabuleiro invalido falha no solucionador', () => {
    const impossivel = '9'.repeat(81);
    assert.isFalse(solver.solve(impossivel));
  });

  test('12. devolve a solucao esperada para um tabuleiro incompleto', () => {
    assert.equal(solver.solve(validPuzzle), validSolution);
  });
});
