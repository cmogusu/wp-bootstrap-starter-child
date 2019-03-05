import React from 'react';
import { initializeIcons } from '@uifabric/icons';
// import PredictionModule from './components/PredictionModule';
// import mi from './functions/machine-learning.js';
// import ModelComplexity from './components/ModelComplexity.js';
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
          <ModelComplexity />
          <PredictionModule hotInstance={{}} colHeaders={colHeaders} />
        */}
      </div>
    );
  }
}

export default App;
