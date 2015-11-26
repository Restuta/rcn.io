import React, {PropTypes} from 'react';;
import Component from 'react-pure-render/component';
import classNames from 'classnames';
import './Event.scss';

const calculateIdealHeightInRems = (widthPx) => {
  //TODO: move this to global variables and pass them through
  const LINE_HEIGHT_REM = 1.35714285714;
  const BASE_FONT_SIZE_PX = 14;
  const heightPx = widthPx / 1.618;
  const lineHeightPx = BASE_FONT_SIZE_PX * LINE_HEIGHT_REM;
  return Math.round(heightPx / lineHeightPx) * LINE_HEIGHT_REM;
};

export class EventName extends Component {
  render() {
    const className = classNames('EventName', this.props.className);

    return (
      <div {...this.props} className={className}>{this.props.children}</div>
    );
  }
};

export default class Event extends Component {
  render() {
    const widthPx = this.props.width || 50;
    const idealHeightRem = calculateIdealHeightInRems(widthPx);

    let style = {
      width: widthPx + 'px',
      height: idealHeightRem + 'rem'
    };

    return (
      <div  {...this.props} style={style} ref={(x) => this.div = x} className="Event lvl-1 debug">
        <EventName>{this.props.name}</EventName>
      </div>
    );
  }
};

Event.propTypes = {
  name: PropTypes.string,
  width: PropTypes.number
};
