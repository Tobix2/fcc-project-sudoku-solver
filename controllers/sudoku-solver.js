class SudokuSolver {

 validate(puzzleString) {
  if (!puzzleString) {
    return { valid: false, error: 'Required field missing' };
  }

  if (puzzleString.length !== 81) {
    return { valid: false, error: 'Expected puzzle to be 81 characters long' };
  }

  if (/[^1-9.]/.test(puzzleString)) {
    return { valid: false, error: 'Invalid characters in puzzle' };
  }

  return { valid: true };
}


  checkRowPlacement(puzzleString, row, column, value) {
  const rowStart = row * 9;
  for (let i = 0; i < 9; i++) {
    if (i !== column && puzzleString[rowStart + i] === value) {
      return false;
    }
  }
  return true;
}


  checkColPlacement(puzzleString, row, column, value) {
  for (let i = 0; i < 9; i++) {
    if (i !== row && puzzleString[i * 9 + column] === value) {
      return false;
    }
  }
  return true;
}


  checkRegionPlacement(puzzleString, row, column, value) {
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(column / 3) * 3;

  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if ((r !== row || c !== column) && puzzleString[r * 9 + c] === value) {
        return false;
      }
    }
  }
  return true;
}


 solve(puzzleString) {
  const validateResult = this.validate(puzzleString);
  if (!validateResult.valid) return false;

  const board = puzzleString.split('');

  const solveRecursive = () => {
    const index = board.findIndex(c => c === '.');
    if (index === -1) return true;

    const row = Math.floor(index / 9);
    const col = index % 9;

    for (let num = 1; num <= 9; num++) {
      const val = num.toString();
      if (this.checkRowPlacement(board.join(''), row, col, val) &&
          this.checkColPlacement(board.join(''), row, col, val) &&
          this.checkRegionPlacement(board.join(''), row, col, val)) {
        board[index] = val;
        if (solveRecursive()) return true;
        board[index] = '.';
      }
    }
    return false;
  };

  if (solveRecursive()) return board.join('');
  return false;
}

}

module.exports = SudokuSolver;

