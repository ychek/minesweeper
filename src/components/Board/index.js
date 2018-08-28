import React, { Component } from 'react';
import Row from '../Row';

class Board extends Component {

  constructor(props) {
    super(props);
    this.newGame = this.newGame.bind(this);
    this.propsContainsZeros = this.propsContainsZeros.bind(this);
    this.initializeEmptyBoard = this.initializeEmptyBoard.bind(this);
    this.placeMinesInFirstCells = this.placeMinesInFirstCells.bind(this);
    this.shuffleBoardInPlaceIteratively = this.shuffleBoardInPlaceIteratively.bind(this);
    this.setNumbersOnCells = this.setNumbersOnCells.bind(this);
    this.createBoard = this.createBoard.bind(this);
    this.toggleFlag = this.toggleFlag.bind(this);
    this.handleShiftClick = this.handleShiftClick.bind(this);
    this.revealCell = this.revealCell.bind(this);
    this.expandCellIterative = this.expandCellIterative.bind(this);
    this.inBound = this.inBound.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.surroundingCellsOffset = [
      // Offset of 8 surrounding cells
      [-1, -1], [-1, 0], [-1, 1],
      [ 0, -1],          [ 0, 1],
      [ 1, -1], [ 1, 0], [ 1, 1]
    ];

    this.state = {
      board: this.createBoard(),
      flagsLeftCount: this.props.minesNum,
      correctlyFlaggedMinesCount: 0
    }
  }

  static getRandomInt(minInclusive, maxInclusive) {

    return Math.floor(Math.random() * (maxInclusive - minInclusive + 1)) + minInclusive;
  }


  newGame() {

    this.setState({
      board: this.createBoard(),
      flagsLeftCount: this.props.minesNum,
      correctlyFlaggedMinesCount: 0
    });

  }

  propsContainsZeros() {
    const { rowsSize, columnsSize, minesNum } = this.props;
    return rowsSize === 0 || columnsSize === 0 || minesNum === 0;
  }

  componentDidUpdate(prevProps) {

    // Check if new props differ from the old
    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      this.newGame();
      return;
    }

    if (this.state.correctlyFlaggedMinesCount === this.props.minesNum) { // All mines are flagged correctly
      if (!this.propsContainsZeros()) {
        // Used for showing the flag before the alert
        setTimeout(() => {
          this.newGame();
          alert("You won!");
        }, 250);
      }
    }
  }

  initializeEmptyBoard() {

    const { rowsSize, columnsSize } = this.props;
    const matrix = [];

    for(let i = 0; i < rowsSize; i++) {
      matrix.push([]);
      for (let j = 0; j < columnsSize; j++) {
        let cell = {
          rowIdx: i,
          columnIdx: j,
          isMine: false,
          number: 0, // "0" Means a blank cell
          isRevealed: false,
          isFlagged: false,
        };
        matrix[i].push(cell)
      }
    }
    return matrix;
  }

  // Place "n" mines in the first cells
  placeMinesInFirstCells(board) {

    /*
   Explanation:
   First we put all "n" mines in the first "n" cells of the board (in the order)
   (i.e: For a 3x3 board with 6 mines, all the mines will be placed in the first two rows)
   */

    const { columnsSize, minesNum } = this.props;

    this.arrayOfMines = []; // Keep references array of mines for later (for the pre-processing of the surrounding mines number )

    for (let i = 0; i < minesNum; i++) {
      const rowIdx = Math.floor(i / columnsSize);
      const colIdx = (i - rowIdx * columnsSize) % columnsSize;
      const cell = board[rowIdx][colIdx];
      cell.isMine = true;
      this.arrayOfMines.push(cell);
    }

  }

  // Shuffle Iteratively all the board by doing (n*m) swaps
  shuffleBoardInPlaceIteratively(board) {
    const { rowsSize, columnsSize } = this.props;
    const totalCellsNum = rowsSize * columnsSize;

    for (let idx1 = 0; idx1 < totalCellsNum; idx1++) {
      const idx2 = Board.getRandomInt(idx1, totalCellsNum - idx1 - 1);
      if (idx1 !== idx2) {

        // Get the first cell at idx1
        const row1 = Math.floor(idx1 / columnsSize);
        const column1 = (idx1 - row1 * columnsSize) % columnsSize;
        const cell1 = board[row1][column1];

        // Get the second cell at idx2
        const row2 = Math.floor(idx2 / columnsSize);
        const column2 = (idx2 - row2 * columnsSize) % columnsSize;
        const cell2 = board[row2][column2];

        // Swap & update "rowIdx" and "columnIdx" property on cell object to be the new one
        board[row1][column1] = cell2;
        cell2.rowIdx = row1;
        cell2.columnIdx = column1;

        board[row2][column2] = cell1;
        cell1.rowIdx = row2;
        cell1.columnIdx = column2;

      }
    }
    return board
  }

  setNumbersOnCells(board) {
    /*
    Here instead of going through each cells in the board and check how many mines are around it. I prefer to implement a faster and better approach.
    Explanation:
    Due to the fact that I am keeping an array of mines. I can iterate on that mines array and increment only cells around each mine.
    */
    for (let mine of this.arrayOfMines) {
      for (let offset of this.surroundingCellsOffset) { //run in constant time (8 times)
        let row = mine.rowIdx + offset[0];
        let col = mine.columnIdx + offset[1];
        if (this.inBound(row, col) && !board[row][col].isMine) {
          board[row][col].number++;
        }
      }
    }
    return board
  }

  createBoard() {

    /*
    Here I used a placing and then shuffling approach. It's better than the other approach that consist of picking a random cell and placing a mine,
    because if we have a situation where we repeatedly pick up a cell already containing a mine it could get very slow
    or in the worst case (if unlucky and the random() fct is badly implemented) it could never end.
    */

    // 1. Create an empty matrix
    let matrix = this.initializeEmptyBoard();


    // 2. Placing
    this.placeMinesInFirstCells(matrix);

    // 3. Shuffling
    matrix = this.shuffleBoardInPlaceIteratively(matrix);

    // 4. Set number only on the cells that surrounds mines
    matrix = this.setNumbersOnCells(matrix);

    return matrix;
  }

  toggleFlag(cell) {
    const matrix = this.state.board;
    const currentCell = matrix[cell.rowIdx][cell.columnIdx];
    let currFlagsLeftCount = this.state.flagsLeftCount;
    let correctFlagsCount = this.state.correctlyFlaggedMinesCount;

    if (!currentCell.isRevealed) {

      if (currentCell.isFlagged) {
        currFlagsLeftCount++;
        if (currentCell.isMine) {
          correctFlagsCount--;
        }
      } else {
        currFlagsLeftCount--;
        if (currentCell.isMine) {
          correctFlagsCount++;
        }
      }
      currentCell.isFlagged = !currentCell.isFlagged;
      this.setState({
        board: matrix,
        flagsLeftCount: currFlagsLeftCount,
        correctlyFlaggedMinesCount: correctFlagsCount
      })
    }

  }


  handleShiftClick(cell) {

    if (!cell.isFlagged && this.state.flagsLeftCount === 0) {
      alert("No more flags left!");
      return;
    }
    this.toggleFlag(cell);
  }

  revealCell(cell) {
    const matrix = this.state.board;
    const currentCell = matrix[cell.rowIdx][cell.columnIdx];
    if (!currentCell.isRevealed && !currentCell.isFlagged) {
      currentCell.isRevealed = true;
      this.setState({ board: matrix });
      return true;
    }
    return false;

  }

  /*
  Here I wanted to use an iterative approach instead of recursive.
  Iterative is faster, more memory efficient and can avoid stack overflow.
  */
  expandCellIterative(cell) {

    const matrix = this.state.board;
    const startingCell = matrix[cell.rowIdx][cell.columnIdx];

    const toVisitQueue = [];
    toVisitQueue.push(startingCell);

    while (toVisitQueue.length > 0) {

      const current = toVisitQueue.shift();

      for (let offset of this.surroundingCellsOffset) { // Run in constant time (8 times)
        let row = current.rowIdx + offset[0];
        let col = current.columnIdx + offset[1];
        if (this.inBound(row, col)) {
          const neighbour = matrix[row][col];
          if (!neighbour.isMine && this.revealCell(neighbour) && neighbour.number === 0)
            toVisitQueue.push(neighbour);
        }
      }
    }
  }


  inBound(rowIdx, colIdx) {
    const { rowsSize, columnsSize } = this.props;
    return rowIdx >= 0 && rowIdx < rowsSize && colIdx >= 0 && colIdx < columnsSize;
  }

  handleClick(cell, event) {

    if (event.shiftKey) {
      this.handleShiftClick(cell);
      return;
    }
    if (cell.isRevealed || cell.isFlagged){
      return;
    }

    this.revealCell(cell);

    if (cell.isMine) {
      this.revealCell(cell);
      // Used to show the mine before showing the alert
      setTimeout(() => {
        this.newGame();
        alert('You lose');
      }, 250);

      return;
    }

    if (cell.number === 0 && !cell.isMine) {
      // It's a blank cell so we need to expand the board
      this.expandCellIterative(cell);

    }

  }

  render() {

    let matrix = this.state.board.map((row, idx) => {
      return (
        <Row
          cells={row}
          key={idx}
          revealCell={this.handleClick}
          data={this.state.board}
        />

      );

    });
    return<div>
      <div className="flags-left">Flags left: {this.state.flagsLeftCount}</div>
      <div className="board">{matrix}</div>
    </div>

  }

}

export default Board;