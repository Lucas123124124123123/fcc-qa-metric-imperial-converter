class SudokuSolver {
  validate(puzzleString) {
    if (!puzzleString) return 'Required field missing';
    if (puzzleString.length !== 81) {
      return 'Expected puzzle to be 81 characters long';
    }
    if (/[^1-9.]/.test(puzzleString)) {
      return 'Invalid characters in puzzle';
    }
    return null;
  }

  letterToRow(letter) {
    return String(letter).toUpperCase().charCodeAt(0) - 65;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const start = row * 9;
    for (let i = 0; i < 9; i++) {
      if (i === column) continue;
      if (puzzleString[start + i] === String(value)) return false;
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 9; i++) {
      if (i === row) continue;
      if (puzzleString[i * 9 + column] === String(value)) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;

    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (r === row && c === column) continue;
        if (puzzleString[r * 9 + c] === String(value)) return false;
      }
    }
    return true;
  }

  isBoardConsistent(puzzleString) {
    for (let i = 0; i < 81; i++) {
      const value = puzzleString[i];
      if (value === '.') continue;
      const row = Math.floor(i / 9);
      const column = i % 9;
      if (
        !this.checkRowPlacement(puzzleString, row, column, value) ||
        !this.checkColPlacement(puzzleString, row, column, value) ||
        !this.checkRegionPlacement(puzzleString, row, column, value)
      ) {
        return false;
      }
    }
    return true;
  }

  solve(puzzleString) {
    if (this.validate(puzzleString) !== null) return false;
    if (!this.isBoardConsistent(puzzleString)) return false;

    const board = puzzleString.split('');

    const backtrack = () => {
      const index = board.indexOf('.');
      if (index === -1) return true;

      const row = Math.floor(index / 9);
      const column = index % 9;
      const current = board.join('');

      for (let value = 1; value <= 9; value++) {
        const v = String(value);
        if (
          this.checkRowPlacement(current, row, column, v) &&
          this.checkColPlacement(current, row, column, v) &&
          this.checkRegionPlacement(current, row, column, v)
        ) {
          board[index] = v;
          if (backtrack()) return true;
          board[index] = '.';
        }
      }
      return false;
    };

    return backtrack() ? board.join('') : false;
  }
}

module.exports = SudokuSolver;
