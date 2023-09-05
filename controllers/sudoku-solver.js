class SudokuSolver {

  validate(puzzleString) {
    if (/[^\d\.]/.test(puzzleString)) {
      return 'Invalid characters in puzzle';
    }

    if (puzzleString.length !== 81) {
      return 'Expected puzzle to be 81 characters long';
    }

    return '';
  }

  getConflict(puzzleString, row, column, value) {
    let grid = this.stringToGrid(puzzleString);

    if (grid[row][column] == value) {
      return [];
    }

    let conflict = [];
    
    if (!this.checkRowPlacement(grid, row, column, value)) {
      conflict.push('row');
    }

    if (!this.checkRowPlacement(grid, row, column, value)) {
      conflict.push('column');
    }

    if (!this.checkRegionPlacement(grid, row, column, value)) {
      conflict.push('region');
    }

    return conflict;
  }

  parseCoordinate(coordinate) {
    const rows = 'ABCDEFGHI';

    if (coordinate.length !== 2) {
      return false;
    }

    let row = rows.indexOf(coordinate[0]);
    let col = parseInt(coordinate[1]) - 1;

    if (row < 0 || row > 8 || col < 0 || col > 8) {
      return false;
    }

    return {
      row: row,
      col: col,
    };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let grid = this.stringToGrid(puzzleString);

    for (let x = 0; x <= 8; x++) {
      if (grid[row][x] == value) {
        return false;
      }
    }

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let grid = this.stringToGrid(puzzleString);

    for (let x = 0; x <= 8; x++) {
      if (grid[x][column] == value) {
        return false;
      }
    }

    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let grid = this.stringToGrid(puzzleString);

    let startRow = row - row % 3;
    let startCol = column - column % 3;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i + startRow][j + startCol] == value) {
          return false;
        }
      }
    }

    return true;
  }

  solve(puzzleString) {
    let grid = this.stringToGrid(puzzleString);

    if (this.solveSudoku(grid, 0, 0)) {
      return this.gridToString(grid);
    }

    return null;
  }

  stringToGrid(puzzleString) {
    if (Array.isArray(puzzleString)) {
      return puzzleString;
    }

    let grid = [];

    for (let row = 0; row < 9; row++) {
      grid[row] = puzzleString.slice(9 * row, 9 * row + 9).replaceAll('.', 0).split('');
    }

    return grid;
  }

  gridToString(grid) {
    let s = '';

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        s += grid[i][j];
      }
    }

    return s;
  }

  solveSudoku(grid, row, col) {
    if (row == 8 && col == 9) {
      return true;
    }

    if (col == 9) {
      row++;
      col = 0;
    }

    if (grid[row][col] != 0) {
      return this.solveSudoku(grid, row, col + 1);
    }

    for (let num = 1; num < 10; num++) {
      if (this.isSafe(grid, row, col, num)) {
        grid[row][col] = num;

        if (this.solveSudoku(grid, row, col + 1)) {
          return true;
        }
      }

      grid[row][col] = 0;
    }

    return false;
  }

  isSafe(grid, row, col, num) {
    if (!this.checkRowPlacement(grid, row, col, num)) {
      return false;
    }

    if (!this.checkColPlacement(grid, row, col, num)) {
      return false;
    }

    if (!this.checkRegionPlacement(grid, row, col, num)) {
      return false;
    }

    return true;
  }
}

module.exports = SudokuSolver;
