import React from 'react';
import { snakeCase } from 'lodash';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { initializeIcons } from '@uifabric/icons';


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

    this.handleChange = this.handleChange.bind(this);
    this.handleTrainAndPredict = this.handleTrainAndPredict.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }


  getColumnIndex(inputColumn) {
    const { colHeaders } = this.props;

    return colHeaders.findIndex(colHeader => colHeader === inputColumn);
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
    const { inputColumnX, inputColumnY } = this.state;
    let inputColumnXIndex;
    let inputColumnYIndex;

    if (inputColumnX) {
      inputColumnXIndex = this.getColumnIndex(inputColumnX);
    }

    if (inputColumnY) {
      inputColumnYIndex = this.getColumnIndex(inputColumnY);
    }
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
              <label>Input Data X</label>
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
              <label>Input Data Y</label>
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
