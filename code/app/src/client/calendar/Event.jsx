import React, {PropTypes} from 'react';;
import Component from 'react-pure-render/component';
import './Event.scss';

const baseLine = 1.3333333;


class EventName extends Component {
  render() {
    const style = {
      //minHeight: baseLine * 3 + 'rem',
      //maxHeight: baseLine * 3 + 'rem',
      // width: '80%',
      // height: '30%',
      // overflow: 'hidden',
      // textOverflow: 'ellipsis',
      // whiteSpace: 'nowrap'
    }

    return(
        <div {...this.props} style={style}>{this.props.children}</div>
    );
  }
};


export default class Event extends Component {
  static propTypes = propTypes

  render() {
    const width = this.props.width || 50;
    const height = width / 1.618;

    let style = {
      width: width + 'px',
      height: height + 'px'
    };

    return (
      <div  {...this.props} style={style} ref={(x) => this.div = x} className="Event lvl-1">
        <EventName className="EventName">{this.props.name}</EventName>
      </div>
    );
  }
};

const propTypes = {
  name: PropTypes.string
};
