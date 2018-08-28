import React from 'react';

const GameSettings = props => {

  return(

      <div>
        <form onSubmit={props.onSubmit}>
          <label>
            Width:
            <input className="input-text" type="text" name="width" defaultValue={props.rowsSize}/>
          </label>
          <label>
            Height:
            <input className="input-text" type="text" name="height" defaultValue={props.columnsSize} />
          </label>
          <label>
            Mines:
            <input className="input-text" type="text" name="mines" defaultValue={props.minesNum} />
          </label>
          <br/>
          <button className="new-game" value="New Game">New Game</button>
        </form>
      </div>
  );

};

export default GameSettings;

