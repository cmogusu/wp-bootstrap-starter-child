import React from 'react';
import {
  calculateMLR,
  calculateSLR,
  calculatePR,
  removeUndefinedValues,
} from '../functions/machine-learning-functions.js';


class MLTest extends React.Component {
  data = [
    [0, 0.23810040097628, 0, -0.058454112947846],
    [1, 1.21536552242826, 2, 1.83215286261689],
    [2, 2.26513724361689, 4, 3.86303035457224],
    [3, 3.23616297045918, 6, 5.7415666619903],
    [4, 4.88376460787225, 8, 8.92899971395165],
    [5, 5.51711745109835, 10, 10.1542775603747],
    [6, 6.53964933710862, 12, 12.1324571495082],
    [7, 7.33261437350318, undefined, 13.6665190906108],
    [8, 8.2317459965478, 16, 15.4059698099339],
    [9, 9.07053580527441, undefined, 17.0286838806612],
  ];

  testMRL = () => {
    const dataX = this.data.map(arr => arr[0]);
    const dataY = this.data.map(arr => arr[1]);
    const dataZ = this.data.map(arr => arr[2]);

    const predictedValues = calculateMLR(dataX, dataY, dataZ);
    console.log(predictedValues);
  };


  testSLR = () => {
    const dataX = this.data.map(arr => arr[0]);
    const dataY = this.data.map(arr => arr[1]);

    const predictedValues = calculateSLR(dataX, dataY);
    console.log(predictedValues);
  };


  testPR = () => {
    const dataX = this.data.map(arr => arr[0]);
    const dataY = this.data.map(arr => arr[3]);

    const predictedValues = calculatePR(dataX, dataY);
    console.log(predictedValues);
  };


  rm = () => {
    const arr1 = [3, 4, 5, undefined, 7];
    const arr2 = [3, null, 5, 6, 7];
    const arr3 = [3, 4, '', 6, 7];
    const results = removeUndefinedValues(arr1, arr2, arr3);

    console.log(results);
  };

  render() {
    // this.rm();
    // this.testMRL();
    // this.testSLR();
    this.testPR();

    return (
      <div>hello world</div>
    );
  }
}

export default MLTest;
