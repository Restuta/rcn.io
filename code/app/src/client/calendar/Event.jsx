import React, {PropTypes} from 'react';;
import Component from 'react-pure-render/component';
import './Event.scss';

var calculateIdealHeightInRems = (widthPx) => {
  //TODO: move this to global variables and pass them through
  const LINE_HEIGHT_REM = 1.3333333;
  const BASE_FONT_SIZE_PX = 15;
  const heightPx = widthPx / 1.618;
  const lineHeightPx = BASE_FONT_SIZE_PX * LINE_HEIGHT_REM;
  return Math.round(heightPx / lineHeightPx) * LINE_HEIGHT_REM;
}

export class EventName extends Component {
  render() {
    return(
        <div {...this.props}>{this.props.children}</div>
    );
  }
};


export default class Event extends Component {
  static propTypes = propTypes

  render() {
    const widthPx = this.props.width || 50;
    const idealHeightRem = calculateIdealHeightInRems(widthPx);


    let style = {
      width: widthPx + 'px',
      height: idealHeightRem + 'rem'
    };

    return (
      <div  {...this.props} style={style} ref={(x) => this.div = x} className="Event lvl-1 debug">
        <EventName className="EventName">{this.props.name}</EventName>
      </div>
    );
  }
};

const propTypes = {
  name: PropTypes.string
};
