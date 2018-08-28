import React from 'react';

const Cell = props => {

  const getValue = () => {

    const { isFlagged, number, isMine, isRevealed } = props.data;

    if (!isRevealed && isFlagged) {
      return <span role="img" aria-label='flag'>🚩</span>;
    }
    if (isMine) {
      return <span role="img" aria-label='mine'>💣</span>
    }
    if (number === 0) {
      return null;
    }
    return number;
  };

  const chooseColorAccordingToNumber = () => {
    const number = props.data.number;
    if (number === 0) {
      return null;
    }

    let value = '';
    switch (number) {
      case 1:
        value = 'black';
        break;
      case 2:
        value = 'green';
        break;
      case 3:
        value = 'red';
        break;
      case 4:
        value = 'blue';
        break;
      case 5:
        value = 'dimgray';
        break;
      case 6:
        value = 'lightseagreen';
        break;
      case 7:
        value = 'indigo';
        break;
      case 8:
        value = 'midnightblue';
        break;
      default:
        value = 'black';
    }


    return { color: value }

  };

  const renderCell = () => {
    const revealedClassName = props.data.isRevealed || props.data.isFlagged ? "cell revealed" : "cell";
    return (
      <div className="cell-wrapper">
        <div
          className={revealedClassName}
          style={chooseColorAccordingToNumber()}
          onClick={(event) => props.revealCell(props.data, event)}>
          {getValue()}
        </div>
      </div>
    );

  };

  return renderCell();
};

export default Cell;