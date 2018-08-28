import React, { Component } from 'react';
import Board from './components/Board'
import GameSettings from './components/GameSettings/GameSettings'

class Minesweeper extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      rowsSize: 10,
      columnsSize: 10,
      minesNum: 10,

    };
  }

  handleSubmit(event) {

    event.preventDefault();

    let { width, height, mines } = event.target;

    let widthVal = parseInt(width.value, 10);
    let heightVal = parseInt(height.value, 10);
    let minesVal = parseInt(mines.value, 10);

    // Validate
    if (isNaN(widthVal) || isNaN(heightVal) || isNaN(minesVal)) {
      widthVal = 0;
      heightVal = 0;
      minesVal = 0;
    }
    if (minesVal > widthVal * heightVal) {
      minesVal = widthVal * heightVal;
      mines.value = minesVal
    }

    this.setState({
      rowsSize: heightVal,
      columnsSize: widthVal,
      minesNum: minesVal
    }, () => this.child.newGame());


  }

  render() {
    return (
      <div className="minesweeper noselect">
        <h1>Minesweeper</h1>
        <GameSettings
          onSubmit={this.handleSubmit}
          rowsSize={this.state.rowsSize}
          columnsSize={this.state.columnsSize}
          minesNum={this.state.minesNum}
        />
        <Board
          rowsSize={this.state.rowsSize}
          columnsSize={this.state.columnsSize}
          minesNum={this.state.minesNum}
          ref={instance => { this.child = instance; }}
        />
      </div>
    );
  }
}

export default Minesweeper;
