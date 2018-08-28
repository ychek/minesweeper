import React from 'react';
import ReactDOM from 'react-dom';
import Minesweeper from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Minesweeper />, div);
  ReactDOM.unmountComponentAtNode(div);
});
