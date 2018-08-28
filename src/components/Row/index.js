import React from 'react';
import Cell from '../Cell'

const Row = props => {

  const cells = props.cells.map((cell, idx) => {
    return <Cell
      key={idx}
      data={cell}
      revealCell={props.revealCell}
    />
  });

  return (
    <div className="row">
      {cells}
    </div>
  );
};

export default Row