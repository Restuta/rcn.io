import React from 'react';;
import Component from 'react-pure-render/component';


class EventName extends Component {
  render() {
    return(
        <span></span>
    );
  }
};


export default class Event extends Component {
  render() {
    const width = this.props.width || 50;
    const height = width / 1.618;

    let style = {
      width: width + 'px',
      height: height + 'px'
    };

    return (
      <div style={style} ref={(x) => this.div = x} className="EventStub"></div>
    );
  }
};
