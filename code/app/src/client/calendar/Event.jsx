import React, {PropTypes} from 'react';;
import Component from 'react-pure-render/component';
import './Event.scss';

const baseLine = 1.3333333;


class EventName extends Component {
  render() {
    const style = {

    }

    return(
        <span>{this.props.children}</span>
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
      <div style={style} ref={(x) => this.div = x} className="Event lvl-1">
        <EventName>{this.props.name}</EventName>
      </div>
    );
  }
};

const propTypes = {
  name: PropTypes.string
};
