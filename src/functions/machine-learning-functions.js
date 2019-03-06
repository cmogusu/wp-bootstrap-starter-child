import math from 'mathjs';


const {
  SimpleLinearRegression: SLR,
  MultivariateLinearRegression: MLR,
  PolynomialRegression: PR,
  RandomForestRegression: RFR,
} = window.ML;


export function removeUndefinedValues(...args) {
  const filteredArray = [];

  if (args.length < 1) {
    return [];
  }

  args[0].forEach((value, index) => {
    let argsIndex = 0;
    let hasNullValue = false;

    while (argsIndex < args.length) {
      if (!args[argsIndex][index]) {
        hasNullValue = true;
        break;
      }

      argsIndex += 1;
    }


    if (!hasNullValue) {
      argsIndex = 0;

      while (argsIndex < args.length) {
        filteredArray[argsIndex] = filteredArray[argsIndex] || [];
        filteredArray[argsIndex].push(args[argsIndex][index]);

        argsIndex += 1;
      }
    }
  });

  return filteredArray;
}


export function removeInputUndefinedValues(inputX, inputY) {
  const filteredVals = removeUndefinedValues(...inputX, ...inputY);

  return [
    filteredVals.slice(0, inputX.length),
    filteredVals.slice(inputX.length),
  ];
}


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
// predictionData = [[3, 3], [4, 4]]


export function tradeAndPredictSLR(dataX, dataY, predictionData) {
  const [
    filteredDataX,
    filteredDataY,
  ] = removeInputUndefinedValues(dataX, dataY);

  const regression = new SLR(filteredDataX[0], filteredDataY[0]);

  return predictionData.map(valueX => (
    (valueX || valueX === 0) ? regression.predict(valueX) : undefined
  ));
}


export function tradeAndPredictMLR(dataX, dataY) {
  const [
    filteredDataX,
    filteredDataY,
  ] = removeUndefinedValues(dataX, dataY);

  const inputDataX = filteredDataX.map((valueX, index) => (
    [filteredDataY[index], filteredDataY[index]]
  ));

  const inputDataY = filteredDataY.map(valueX => [valueX]);

  const mlr = new MLR(inputDataX, inputDataY);

  return mlr.predict(inputDataX);
}


export function tradeAndPredictPR(dataX, dataY, predictionData, scale) {
  /*
  const [
    filteredDataX,
    filteredDataY,
  ] = removeUndefinedValues(dataX, dataY);

  const poly = new PR(filteredDataX, filteredDataY, scale);

  return poly.predict(filteredDataX);
  */

  return predictionData[0];
}


export function tradeAndPredictDecisionTree(dataX, dataY, predictionData) {
  return predictionData[0];
}


export function tradeAndPredictRandomForest(dataX, dataY, predictionData) {
  /*
  const RFoptions = {
    seed: 3,
    maxFeatures: 2,
    replacement: false,
    nEstimators: 100,
  };
  const rfr = new RFR(RFoptions);
  const {
    cleanedArrayX,
    cleanedArrayY,
  } = removeUndefinedValues(dataX, dataY);

  rfr.train(cleanedArrayX, cleanedArrayY);

  return rfr.predict(predictionData);
  */
  return predictionData[0];
}


export function tradeAndPredictNeuralNetwork(dataX, dataY, predictionData) {
  return predictionData[0];
}
