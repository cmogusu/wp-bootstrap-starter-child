import math from 'mathjs';
import MLR from 'ml-regression-multivariate-linear';
import PolynomialRegression from 'ml-regression-polynomial';
import { RandomForestRegression as RFR, RandomForestClassifier as RFC } from 'ml-random-forest';
// import LR from 'ml-regression-simple-linear';

function MI() {
  // Data
  // const x = [[0, 0], [1, 2], [2, 3], [3, 4]];
  const a1 = math.random([10, 2]);
  const a2 = math.reshape(math.range(0, 20, 1), [10, 2]);
  const x = math.add(a1, a2).valueOf();

console.log(a1, a2, x);
  const y = [];
  for (let i = 0; i < 5; i++) {
    y.push(0);
  }

  for (let i = 5; i < 10; i++) {
    y.push(1);
  }
  const y_multi = [];
  // [[0, 0, 0], [2, 4, 3], [4, 6, 5], [6, 8, 7]];

  for (let i = 0; i < 5; i++) {
    y_multi.push([0]);
  }

  for (let i = 5; i < 10; i++) {
    y_multi.push([1]);
  }
  // Y0 = X0 * 2, Y1 = X1 * 2, Y2 = X0 + X1
  console.log(y);
  const mlr = new MLR(x, y_multi);
  const result = mlr.predict([[3, 3], [4, 4]]);
  console.log(result);

  return 'hellow world';

  // ML
  // const lr = new LR(x, y);
  // const mlr = new MLR(x, y_multi);
  

  // const poly = new PolynomialRegression(x, y, 2);
  const poly = mlr;

  const RFoptions = {
    seed: 3,
    maxFeatures: 2,
    replacement: false,
    nEstimators: 100,
  };

  const rfr = new RFR(RFoptions);
  rfr.train(x, y_multi);

  let models = [mlr, poly, rfr];

  for (let i = 0; i < models.length; i++) {
    console.log(models[i].predict([[3, 3], [4, 4]]));
  }

  return 'hello world';
}

export default MI;
