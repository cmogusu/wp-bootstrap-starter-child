import React from 'react';
import { snakeCase, isNumber } from 'lodash';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { PrimaryButton, DefaultButton, IconButton } from 'office-ui-fabric-react/lib/Button';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import ModelComplexityWrapper from './ModelComplexityWrapper.js';
// import { calculateMLR } from '../functions/machine-learning-functions.js';

type Props = {
  hotInstance?: {},
  colHeaders?: Array,
};

type State = {
  inputColumnX: string,
  inputColumnY: string,
  isModalVisible: boolean,
  modelComplexitySliderValue: number,
  useAIModelComplexity: boolean,
};

class PredictionModule extends React.Component<Props, State> {
  state = {
    inputColumnX: '',
    inputColumnY: '',
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
    const { colHeaders: originalColHeaders } = this.props;
    const colHeaders = originalColHeaders.slice(0);
    const otherColumn = column === 'inputColumnX' ? 'inputColumnY' : 'inputColumnX';

    return colHeaders
      .map(colHeader => (
        (colHeader === 'No' || this.state[otherColumn] === snakeCase(colHeader))
          ? false
          : colHeader
      ))
      .filter(colHeader => !!colHeader)
      .map(colHeader => ({
        key: snakeCase(colHeader),
        text: colHeader,
      }));
  }


  setOptions(options) {
    this.setState(options);
  }


  trainMLAndGetHypothesis = () => (
    x => (isNumber(x) ? x * 2 : undefined)
  );


  handleChange(column, newValue) {
    const { hotInstance, colHeaders } = this.props;
    const colHeaderIndex = colHeaders.findIndex(
      colHeader => colHeader === newValue.text,
    );

    hotInstance.selectColumns(colHeaderIndex);

    this.setState({
      [column]: newValue.key,
    });
  }


  handleTrainAndPredict() {
    const { hotInstance, colHeaders } = this.props;
    const { inputColumnX, inputColumnY } = this.state;
    const data = [inputColumnX, inputColumnY];

    if (!inputColumnX || !inputColumnY) {
      console.log('please select both X and Y columns');
      return;
    }

    const dataValuesArray = data
      .map(columnName => (
        colHeaders.findIndex(colHeader => snakeCase(colHeader) === columnName)
      ))
      .map(columnIndex => (
        hotInstance.getDataAtCol(columnIndex)
      ));

    const cleanedDataValues = [[], []];

    dataValuesArray[0].forEach((dataValue, index) => {
      const valueX = dataValuesArray[0][index];
      const valueY = dataValuesArray[1][index];

      if (valueX && valueY) {
        cleanedDataValues[0].push(valueX);
        cleanedDataValues[1].push(valueY);
      }
    });

    const mlEquation = this.trainMLAndGetHypothesis(dataValuesArray[0], dataValuesArray[1]);

    this.addPredictedValuesColumn(dataValuesArray[0], mlEquation);
  }


  addPredictedValuesColumn(arrayX, mlEquation) {
    const { inputColumnX } = this.state;
    const { hotInstance, colHeaders } = this.props;
    const preditedValues = arrayX.map(dataValue => mlEquation(dataValue));

    const sourceData = hotInstance.getSourceData();
    const newColHeaders = colHeaders.slice(0);
    let lastColumnIndex = colHeaders.length;

    while (!hotInstance.isEmptyCol(lastColumnIndex)) {
      lastColumnIndex += 1;
    }

    newColHeaders[lastColumnIndex] = `${inputColumnX} Predictions`;

    const newSourceData = sourceData.map((dataRow, index) => {
      const dataRowClone = dataRow.slice();
      dataRowClone[lastColumnIndex] = preditedValues[index];

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
      inputColumnX: '',
      inputColumnY: '',
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
      inputColumnX,
      inputColumnY,
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
                options={this.getSelectOptions('inputColumnX')}
                selectedKeys={inputColumnX}
                onChange={(event, newValue) => this.handleChange('inputColumnX', newValue)}
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
                options={this.getSelectOptions('inputColumnY')}
                selectedKeys={inputColumnY}
                onChange={(event, newValue) => this.handleChange('inputColumnY', newValue)}
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
