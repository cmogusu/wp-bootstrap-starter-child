import React from 'react';
import { snakeCase } from 'lodash';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { PrimaryButton, DefaultButton, IconButton } from 'office-ui-fabric-react/lib/Button';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import ModelComplexityWrapper from './ModelComplexityWrapper.js';
import {
  tradeAndPredictSLR,
  tradeAndPredictPR,
  tradeAndPredictDecisionTree,
  tradeAndPredictRandomForest,
  tradeAndPredictNeuralNetwork,
} from '../functions/machine-learning-functions.js';

type Props = {
  hotInstance?: {},
  colHeaders?: Array,
};

type State = {
  inputX: Array,
  inputY: Array,
  isModalVisible: boolean,
  modelComplexitySliderValue: number,
  useAIModelComplexity: boolean,
};

class PredictionModule extends React.Component<Props, State> {
  state = {
    inputX: [],
    inputY: [],
    isModalVisible: false,
    modelComplexitySliderValue: 0,
    useAIModelComplexity: true,
  };


  constructor(props) {
    super(props);

    this.colHeaders = [];
    this.setOptions = this.setOptions.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleIsModalVisible = this.toggleIsModalVisible.bind(this);
    this.handleTrainAndPredict = this.handleTrainAndPredict.bind(this);
  }

  setColumnHeaders() {
    const { hotInstance } = this.props;
    let colCount = hotInstance.countSourceCols();
    const colHeaders = [];

    while (colCount > 0) {
      colCount -= 0;
      colHeaders(hotInstance.getColHeader(colCount));
    }

    this.colHeaders = colHeaders;
  }


  getSelectOptions(column: string) {
    const { colHeaders } = this.props;
    const { inputX, inputY } = this.state;

    const previouslySelectedColumns = column === 'inputX' ? inputY : inputX;

    return colHeaders
      .filter(colHeader => (
        !(colHeader === 'No' || previouslySelectedColumns.includes(snakeCase(colHeader)))
      )).map(colHeader => ({
        key: snakeCase(colHeader),
        text: colHeader,
      }));
  }


  getColumnValues(columnIds) {
    const { hotInstance } = this.props;

    const colHeaderIndexes = this.getColumnIndexes(columnIds);

    const data = colHeaderIndexes.map(colHeaderIndex => (
      hotInstance.getDataAtCol(colHeaderIndex)
    ));

    return data;
  }


  setOptions(options) {
    this.setState(options);
  }


  getColumnIndexes(columnIds) {
    const { colHeaders } = this.props;

    return columnIds.map(columnId => (
      colHeaders.findIndex(
        colHeader => snakeCase(colHeader) === columnId,
      )
    ));
  }


  handleChange(column, newValue) {
    const { key: inputKey, selected } = newValue;

    this.setState((prevState) => {
      const { inputX, inputY } = prevState;
      const inputVals = column === 'inputX' ? inputX : inputY;

      if (selected && !inputVals.includes(inputKey)) {
        inputVals.push(inputKey);
      } else if (!selected && inputVals.includes(inputKey)) {
        const inputValsIndex = inputVals.indexOf(inputKey);
        inputVals.splice(inputValsIndex, 1);
      }

      this.highlightColumns(inputVals);

      return {
        [column]: inputVals,
      };
    });
  }


  highlightColumns(columnIds) {
    const { hotInstance } = this.props;
    const colHeaderIndexes = this.getColumnIndexes(columnIds);

    hotInstance.selectColumns(...colHeaderIndexes.sort());
  }


  handleTrainAndPredict() {
    const { inputX, inputY, modelComplexitySliderValue } = this.state;

    if (inputX.length < 1 || inputY.length < 1) {
      alert('please select both X and Y columns');
      return;
    }

    const dataX = this.getColumnValues(inputX);
    const dataY = this.getColumnValues(inputY);


    let predictedValues;
    let inputColumns;

    switch (modelComplexitySliderValue) {
      case 1:
        inputColumns = inputX.slice(0, 1);
        predictedValues = tradeAndPredictSLR(dataX, dataY, dataX[0]);
        break;

      case 2:
      case 3:
      case 4:
        inputColumns = inputX;
        predictedValues = tradeAndPredictPR(dataX, dataY, dataX, modelComplexitySliderValue);
        break;

      case 5:
        inputColumns = inputX;
        predictedValues = tradeAndPredictDecisionTree(dataX, dataY, dataX, 3);
        break;

      case 6:
        inputColumns = inputX;
        predictedValues = tradeAndPredictRandomForest(dataX, dataY, dataX, 3);
        break;

      case 7:
        inputColumns = inputX;
        predictedValues = tradeAndPredictNeuralNetwork(dataX, dataY, dataX, 3);
        break;

      default:
        inputColumns = inputX.slice(0, 1);
        predictedValues = tradeAndPredictSLR(dataX, dataY, dataX[0]);
    }

    this.addPredictedValuesColumn(predictedValues, inputColumns);
  }


  addPredictedValuesColumn(predictedValues, inputColumns) {
    const { hotInstance, colHeaders } = this.props;

    const sourceData = hotInstance.getSourceData();
    const newColHeaders = colHeaders.slice(0);
    let lastColumnIndex = colHeaders.length;

    while (!hotInstance.isEmptyCol(lastColumnIndex)) {
      lastColumnIndex += 1;
    }

    const inputXTitles = this.getColumnIndexes(inputColumns).map(
      index => colHeaders[index],
    );
    newColHeaders[lastColumnIndex] = `${inputXTitles.join(' & ')} Predictions`;

    const newSourceData = sourceData.map((dataRow, index) => {
      const dataRowClone = dataRow.slice();
      dataRowClone[lastColumnIndex] = predictedValues[index];

      return dataRowClone;
    });

    hotInstance.loadData(newSourceData);
    hotInstance.updateSettings({
      colHeaders: newColHeaders,
    });
    hotInstance.selectColumns(lastColumnIndex);
  }


  handleReset() {
    this.setState({
      inputX: [],
      inputY: [],
    });
  }

  toggleIsModalVisible() {
    this.setState((prevState) => {
      const { isModalVisible } = prevState;

      return {
        isModalVisible: !isModalVisible,
      };
    });
  }


  render() {
    const {
      inputX,
      inputY,
      isModalVisible,
      useAIModelComplexity,
      modelComplexitySliderValue,
    } = this.state;
    const styles = mergeStyleSets({
      item: {
        width: '49%',
      },
    });

    return (
      <div>
        <ModelComplexityWrapper
          isModalVisible={isModalVisible}
          hideModal={() => this.setState({ isModalVisible: false })}
          setOptions={this.setOptions}
          useAIModelComplexity={useAIModelComplexity}
          modelComplexitySliderValue={modelComplexitySliderValue}
        />

        <div>
          <Stack horizontal verticalAlign="center" padding={10}>
            <Stack.Item align="start" grow>
              <h1 className="mb-0">Predict</h1>
            </Stack.Item>

            <Stack.Item align="end">
              <IconButton
                iconProps={{ iconName: 'ChevronRight' }}
                title="Predict"
                ariaLabel="Predict"
                onClick={this.toggleIsModalVisible}
              />
            </Stack.Item>
          </Stack>
          <hr />

          <h2>Input</h2>
          <hr />

          <Stack gap={5} padding={10} horizontal>
            <Stack.Item className={styles.item}>
              <Label htmlFor="dropdown-1">Input Data X</Label>
            </Stack.Item>

            <Stack.Item className={styles.item}>
              <Dropdown
                id="dropdown-1"
                className="the-dropdown"
                placeholder="Select a column"
                ariaLabel="Input Data dropdown"
                options={this.getSelectOptions('inputX')}
                selectedKeys={inputX}
                onChange={(event, newValue) => this.handleChange('inputX', newValue)}
                multiSelect
              />
            </Stack.Item>
          </Stack>

          <Stack gap={5} padding={10} horizontal>
            <Stack.Item className={styles.item}>
              <Label htmlFor="dropdown-2">Input Data Y</Label>
            </Stack.Item>

            <Stack.Item className={styles.item}>
              <Dropdown
                id="dropdown-1"
                className="the-dropdown"
                placeholder="Select a column"
                ariaLabel="Input Data dropdown"
                options={this.getSelectOptions('inputY')}
                selectedKeys={inputY}
                onChange={(event, newValue) => this.handleChange('inputY', newValue)}
                multiSelect
              />
            </Stack.Item>
          </Stack>


          <Stack horizontal gap={5} padding={10}>
            <Stack.Item className={styles.item}>
              <PrimaryButton onClick={this.handleTrainAndPredict}>
                Train and Predict
              </PrimaryButton>
            </Stack.Item>

            <Stack.Item className={styles.item}>
              <DefaultButton onClick={this.handleReset}>
                Reset
              </DefaultButton>
            </Stack.Item>
          </Stack>
        </div>
      </div>
    );
  }
}

PredictionModule.defaultProps = {
  colHeaders: [],
  hotInstance: {},
};


export default PredictionModule;
