import React from 'react';
import { snakeCase } from 'lodash';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { initializeIcons } from '@uifabric/icons';
import { calculateMLR } from '../functions/machine-learning-functions.js';

type Props = {
  hotInstance?: {},
  colHeaders?: Array,
};

class PredictionModule extends React.Component<Props> {
  state = {
    inputColumnX: '',
    inputColumnY: '',
  };

  constructor(props) {
    super(props);

    initializeIcons();

    this.colHeaders = [];
    this.handleChange = this.handleChange.bind(this);
    this.handleTrainAndPredict = this.handleTrainAndPredict.bind(this);
    this.handleReset = this.handleReset.bind(this);
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
    let colHeaders = originalColHeaders.slice(0);
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
    let inputColumnXIndex;
    let inputColumnYIndex;

    if (inputColumnX) {
      inputColumnXIndex = this.getColumnIndex(inputColumnX);
    }

    if (inputColumnY) {
      inputColumnYIndex = this.getColumnIndex(inputColumnY);
    }

    const lastColumnIndex = hotInstance.countSourceCols();
    const newColHeaders = colHeaders.push('new header');

    hotInstance.alter('insert_col', lastColumnIndex, 1);
    hotInstance.updateSettings({
      colHeaders: newColHeaders,
    });

    calculateMLR();
  }


  handleReset() {
    const { hotInstance } = this.props;

    this.data = [[]];
    hotInstance.setData(this.data);
  }


  render() {
    const { inputColumnX, inputColumnY } = this.state;
    const styles = mergeStyleSets({
      item: {
        width: '49%',
      },
    });

    return (
      <div>
        <div>
          <h1>Predict</h1>
          <hr />

          <h2>Input</h2>
          <hr />

          <Stack gap={5} padding={10} horizontal>
            <Stack.Item className={styles.item}>
              <span>Input Data X</span>
            </Stack.Item>

            <Stack.Item className={styles.item}>
              <Dropdown
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
              <span>Input Data Y</span>
            </Stack.Item>

            <Stack.Item className={styles.item}>
              <Dropdown
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
