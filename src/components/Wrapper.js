import React from 'react';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { mergeStyleSets, DefaultPalette } from 'office-ui-fabric-react/lib/Styling';
import HandsonTable from '../handson-table/handson-table';
import PredictionModule from './PredictionModule.js';
import ModelComplexityWrapper from './ModelComplexityWrapper.js';


class Wrapper extends React.Component {
  state = {
    hotInstance: null,
  };

  hotInstance = null;

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

    this.setHotTable = this.setHotTable.bind(this);
  }


  setHotTable(hotInstance) {
    this.setState({ hotInstance });
    window.hot = hotInstance;
  }


  render() {
    const styles = mergeStyleSets({
      root: {
        height: '100vh',
      },
      handsOnTable: {
        width: '49%',
        padding: '20px',
        background: DefaultPalette.white,
      },
      predict: {
        color: DefaultPalette.white,
        background: '#9fa5b3',
        width: '49%',
        padding: '10px',
      },
    });

    const { hotInstance } = this.state;

    return (
      <div>
        <Stack
          className={styles.root}
          horizontal
        >
          <Stack.Item align="stretch" className={styles.handsOnTable}>
            <HandsonTable
              data={this.data}
              colHeaders={this.colHeaders}
              minRows={6}
              minCols={4}
              dropdownMenu={1}
              licenseKey="00000-00000-00000-00000-00000"
              setHotInstance={this.setHotTable}
            />
          </Stack.Item>

          <Stack.Item align="stretch" className={styles.predict}>
            <PredictionModule
              hotInstance={hotInstance}
              data={this.data}
              colHeaders={this.colHeaders}
            />
          </Stack.Item>
        </Stack>
        {/* <ModelComplexityWrapper /> */}
      </div>
    );
  }
}

export default Wrapper;
