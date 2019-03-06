import React from 'react';
import { initializeIcons } from '@uifabric/icons';
// import PredictionModule from './components/PredictionModule';
import Wrapper from './components/Wrapper.js';
import 'handsontable-pro/dist/handsontable.full.css';
import './App.css';


class App extends React.Component {
  constructor(props) {
    super(props);

    initializeIcons();
  }


  render() {
    // const colHeaders = ['No', 'X', 'Y', 'Y Predicate'];

    return (
      <div>
        <Wrapper />
        {/*
          <PredictionModule hotInstance={{selectColumns: console.log}} colHeaders={colHeaders} />
        */}
      </div>
    );
  }
}

export default App;
