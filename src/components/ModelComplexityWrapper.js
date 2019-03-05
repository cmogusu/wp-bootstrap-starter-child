import * as React from 'react';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';


type Props = {
  isModalVisible: boolean,
  hideModal: Function,
  setOptions: Function,
  useAIModelComplexity: boolean,
  modelComplexitySliderValue: number,
};

type State = {
  value: number,
  modelComplexitySelection: boolean,
};

class ModelComplexity extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }


  handleCheckboxChange(event) {
    const { currentTarget } = event;
    const { checked } = currentTarget;
    const { setOptions } = this.props;

    setOptions({ useAIModelComplexity: checked });
  }


  render() {
    const {
      setOptions,
      isModalVisible,
      hideModal,
      useAIModelComplexity,
      modelComplexitySliderValue,
    } = this.props;

    let sliderTextValue;

    if (modelComplexitySliderValue < 7) {
      sliderTextValue = modelComplexitySliderValue;
    } else if (modelComplexitySliderValue === 7) {
      sliderTextValue = 'Random Forest';
    } else {
      sliderTextValue = 'Neural';
    }

    return (
      <Modal
        titleAriaId="Model Complexity Selection"
        isOpen={isModalVisible}
        onDismiss={hideModal}
        containerClassName="complexity-modal"
      >
        <div>
          <Checkbox
            label="AI Model Complexity Selection"
            value={useAIModelComplexity}
            onChange={this.handleCheckboxChange}
            checked={useAIModelComplexity}
          />
        </div>

        <div>
          <Label htmlFor="complexity-slider">
            Smoothness/Complexity
          </Label>
          <Slider
            id="complexity-slider"
            label={`Complexity: ${sliderTextValue}`}
            min={0}
            max={8}
            step={1}
            showValue=""
            value={modelComplexitySliderValue}
            onChange={newValue => setOptions({ modelComplexitySliderValue: newValue })}
          />
        </div>

        <PrimaryButton onClick={hideModal}>
          Predict
        </PrimaryButton>
      </Modal>
    );
  }
}

export default ModelComplexity;
