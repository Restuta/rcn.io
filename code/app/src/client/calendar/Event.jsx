import React, {PropTypes} from 'react';
import Component from 'react-pure-render/component';
import Typography, { calculateIdealHeightInRems } from '../styles/typography';
import classNames from 'classnames';
import './Event.scss';

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
      height: idealHeightRem + 'rem',
      //paddingTop: ''
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
