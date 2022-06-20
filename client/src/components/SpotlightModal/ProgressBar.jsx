/*   eslint max-classes-per-file: 0, react/prefer-stateless-function: 0, jsx-a11y/click-events-have-key-events: 0, jsx-a11y/no-static-element-interactions: 0 */

import React, { useEffect, useState } from 'react';
import { WithStore } from 'pure-react-carousel';
import './ProgressBar.scss';

const Slider = (props) => {
  const [position, setPosition] = useState(props.position);

  const updatePosition = (positionInput) => {
    if (positionInput === position) {
      return;
    }
    if (props.clickable) {
      setPosition(positionInput);
      if (props.positionChangeListener) {
        props.positionChangeListener(positionInput);
      }
      props.setStoreState({ currentSlide: positionInput });
    }
  };

  useEffect(() => {
    updatePosition(props.position);
  }, [props.position]);

  function generateDotHolders() {
    const dotHolders = [];
    for (let i = 0; i < props.length; i++) {
      dotHolders.push(<DotHolder key={i} position={i} clickable={props.clickable} size={props.size} updatePosition={updatePosition} />);
    }
    return dotHolders;
  }

  const dotHolders = generateDotHolders();
  const SliderStyle = `slider slider-${props.size}`;
  return (
    <div className={SliderStyle}>
      <div className="dot-holders">
        {dotHolders}
      </div>
      <Dot position={position} />
    </div>
  );
};

class DotHolder extends React.Component {
  render() {
    const dotHolderStyle = this.props.clickable ? 'dot-holder dot-holder-clickable' : 'dot-holder';
    return (
      <div className={dotHolderStyle} onClick={(e) => this.props.updatePosition(this.props.position, e)} />
    );
  }
}

class Dot extends React.Component {
  render() {
    const positionClass = `dot dot-position-${this.props.position}`;
    return (
      <div className={positionClass} onClick={this.props.onClick} />
    );
  }
}

Slider.defaultProps = {
  position: 0,
  length: 3,
  size: 'normal',
  clickable: true,
  positionChangeListener: null,
};

const SliderExport = (props) => {
  const { length, current } = props;

  useEffect(() => {

  }, [current]);

  return (
    <div className="slider-panel">
      <Slider setStoreState={props.carouselStore.setStoreState} length={length} size="normal" position={current} clickable />
    </div>
  );
};

export default WithStore(SliderExport);
