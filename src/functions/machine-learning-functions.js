import math from 'mathjs';
import MLR from 'ml-regression-multivariate-linear';
import PolynomialRegression from 'ml-regression-polynomial';
import {
  RandomForestRegression as RFR,
  // RandomForestClassifier as RFC,
} from 'ml-random-forest';
// import LR from 'ml-regression-simple-linear';

export function getTrainingData() {
  const a1 = math.random([10, 2]);
  const a2 = math.reshape(math.range(0, 20, 1), [10, 2]);
  const x = math.add(a1, a2).valueOf();
  const yMulti = [];

  const y = [];
  for (let i = 0; i < 5; i += 1) {
    y.push(0);
  }

  for (let i = 5; i < 10; i += 1) {
    y.push(1);
  }


  for (let i = 0; i < 5; i += 1) {
    yMulti.push([0]);
  }

  for (let i = 5; i < 10; i += 1) {
    yMulti.push([1]);
  }

  return {
    x,
    y: yMulti,
  };
}


export function calculateMLR() {
  const { x, y } = getTrainingData();
  const mlr = new MLR(x, y);

  return mlr.predict([[3, 3], [4, 4]]);
}

export function calculatePolynomialRegression() {
  const { x, y } = getTrainingData();
  const poly = new PolynomialRegression(x, y, 2);

  return poly.predict([[3, 3], [4, 4]]);
}

export function calculateRFR() {
  const { x, y } = getTrainingData();
  const RFoptions = {
    seed: 3,
    maxFeatures: 2,
    replacement: false,
    nEstimators: 100,
  };
  const rfr = new RFR(RFoptions);

  rfr.train(x, y);

  return rfr.predict([[3, 3], [4, 4]]);
}

export function cleanData(arrayX, arrayY) {
  return arrayX.map((valueX, index) => {
    const valueY = arrayY[index];

    return (valueX && valueY)
      ? valueY / valueX
      : undefined;
  });
}
