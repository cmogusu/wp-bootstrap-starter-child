import * as React from 'react';
// import { Checkmark } from 'office-ui-fabric-react/lib/Icons/Checkmark';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import { Modal } from 'office-ui-fabric-react/lib/Modal';

type Props = {};

type State = {
  value: number,
  modelComplexitySelection: boolean,
};

class ModelComplexity extends React.Component<Props, State> {
  state = {
    sliderValue: 0,
    modelComplexitySelection: false,
    isModalVisible: true,
  };

  constructor(props) {
    super(props);

    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }


  handleCheckboxChange(event) {
    const { currentTarget } = event;
    const { checked } = currentTarget;

    this.setState({ modelComplexitySelection: checked });
  }


  render() {
    const {
      sliderValue,
      modelComplexitySelection,
      isModalVisible,
    } = this.state;

    const sliderTextValue = sliderValue < 7
      ? sliderValue : sliderValue === 7
      ? 'Random Forest' : 'Neural';

    return (
      <div>
        <div>
          <Checkbox
            label="AI Model Complexity Selection"
            value={modelComplexitySelection}
            onChange={this.handleCheckboxChange}
            checked={modelComplexitySelection}
          />
        </div>

        <Modal
          titleAriaId="title aria id"
          subtitleAriaId="sub title aria id"
          isOpen={isModalVisible}
          onDismiss={event => this.setState({ isModalVisible: false })}
          isBlocking={false}
          containerClassName="ms-modal-example-container"
        >
          {!modelComplexitySelection && (
            <div>
              <label>
                Smoothness/Complexity
              </label>
              <Slider
                label={`Complexity: ${sliderTextValue}`}
                min={0}
                max={8}
                step={1}
                showValue={0}
                value={sliderValue}
                onChange={newValue => this.setState({ sliderValue: newValue })}
              />
            </div>
          )}
        </Modal>
      </div>
    );
  }
}

export default ModelComplexity;
