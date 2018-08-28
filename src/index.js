import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Minesweeper from './Minesweeper';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Minesweeper />, document.getElementById('root'));
registerServiceWorker();
