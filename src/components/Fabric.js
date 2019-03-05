import * as React from 'react';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { mergeStyleSets, DefaultPalette } from 'office-ui-fabric-react/lib/Styling';

import { initializeIcons } from '@uifabric/icons';

class Fabric extends React.Component<{}, {}> {
  constructor(props) {
    super(props);

    initializeIcons();
  }

  render() {
    const styles = mergeStyleSets({
      root: {
        background: DefaultPalette.themeTertiary,
      },
      item: {
        color: DefaultPalette.white,
        background: DefaultPalette.themePrimary,
        padding: 10,
      },
    });
    console.log(DefaultPalette);

    return (
      <div>
        <Stack
          gap={5}
          padding={10}
          className={styles.root}
          horizontalAlign="center"
          verticalAlign="center"
          verticalGap={20}
          horizontal
        >
          <span>item one</span>
          <span>hello two</span>
          <span>vertical stack</span>
          <span>hello world</span>
        </Stack>

        <Stack gap={10} padding={5} className={styles.root}>
          <Stack.Item align="auto" className={styles.item}>
            <span>hello world</span>
          </Stack.Item>

          <Stack.Item align="stretch" className={styles.item}>
            <span>stretched</span>
          </Stack.Item>

          <Stack.Item align="baseline" className={styles.item}>
            <span>baseline</span>
          </Stack.Item>

          <Stack.Item align="start" className={styles.item}>
            <span>start</span>
          </Stack.Item>

          <Stack.Item align="center" className={styles.item}>
            <span>Center</span>
          </Stack.Item>

          <Stack.Item align="end">
            <span>End</span>
          </Stack.Item>
        </Stack>

        <DefaultButton>
          click me
        </DefaultButton>

        <br/>
        
        <DefaultButton
          text="See Button"
          primary={true}
          href="tea"
        />
      </div>
    );
  }
}

export default Fabric;
