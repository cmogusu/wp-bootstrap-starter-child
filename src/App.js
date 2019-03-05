import React from 'react';
// import PredictionModule from './components/prediction-module';
// import mi from './functions/machine-learning.js';
import ModelComplexity from './components/model-complexity.js';
import 'handsontable-pro/dist/handsontable.full.css';

export default () => {
  return (
    <div>
      <ModelComplexity />
      {/* <PredictionModule /> */}
    </div>
  );
};
