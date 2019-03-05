import React from 'react';
import { snakeCase } from 'lodash';
import HandsonTable from '../handson-table/handson-table';


type Props = {
  handsOnTableInstance: {},
};

class PredictionModule extends React.Component<Props> {
  state = {
    inputColumnX: '',
    inputColumnY: '',
  };

  colHeaders = [
    'No',
    'X',
    'Y',
    'Y Predicate',
  ];

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


  constructor(props) {
    super(props);

    this.hotInstance = null;
    this.setHotTable = this.setHotTable.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleTrainAndPredict = this.handleTrainAndPredict.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }


  getColumnIndex(inputColumn) {
    return this.colHeaders.findIndex(colHeader => colHeader === inputColumn);
  }


  getSelectOptions(column: string) {
    let colHeaders = this.colHeaders.slice(0);
    const otherColumn = column === 'inputColumnX' ? 'inputColumnY' : 'inputColumnX';

    colHeaders = colHeaders.map(colHeader => (
      (colHeader === 'No' || this.state[otherColumn] === colHeader)
        ? false
        : colHeader
    ));


    return colHeaders.map((colHeader, index) => {
      if (!colHeader) {
        return '';
      }

      return (
        <option
          key={snakeCase(colHeader)}
          value={index}
        >
          {colHeader}
        </option>
      );
    });
  }


  setHotTable(hotInstance) {
    this.hotInstance = hotInstance;
    window.hot = hotInstance;
  }


  handleChange(column, event) {
    const { currentTarget } = event;
    const { value: colHeaderIndex } = currentTarget;
    const textVal = this.colHeaders[colHeaderIndex];

    this.hotInstance.selectColumns(parseInt(colHeaderIndex, 10));

    this.setState({
      [column]: textVal,
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

    console.log(inputColumnYIndex, inputColumnXIndex);
  }


  handleReset() {
    this.data = [[]];
    this.hotInstance.setData(this.data);
  }


  render() {
    const { inputColumnX, inputColumnY } = this.state;
    const inputColumnXIndex = this.getColumnIndex(inputColumnX);
    const inputColumnYIndex = this.getColumnIndex(inputColumnY);

    return (
      <div>
        <HandsonTable
          data={this.data}
          colHeaders={Object.values(this.colHeaders)}
          minRows={6}
          minCols={4}
          dropdownMenu={1}
          licenseKey="00000-00000-00000-00000-00000"
          setHotInstance={this.setHotTable}
        />

        <div>
          <h1>Predict</h1>
          input
          <hr/>
          
          <div>
            <label>Input Data X</label>
            <select
              id="inputColumnX"
              value={inputColumnXIndex}
              onChange={event => this.handleChange('inputColumnX', event)}
            >
              {this.getSelectOptions('inputColumnX')}
            </select>
          </div>
          
          <div>
            <label>Input Data Y</label>
            <select
              id="inputColumnY"
              value={inputColumnYIndex}
              onChange={event => this.handleChange('inputColumnY', event)}
            >
              {this.getSelectOptions('inputColumnY')}
            </select>
          </div>

          <div>
            <button type="button" onClick={this.handleTrainAndPredict}>
              Train and Predict
            </button>

            <button type="button" onClick={this.handleReset}>
              Reset
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default PredictionModule;
