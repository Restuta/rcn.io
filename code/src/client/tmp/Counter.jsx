import React from 'react';
import Component from 'react-pure-render/component';


export default class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.interval = setInterval(() => this.tick(), 1000);
  }

  tick() {
    this.setState({
      counter: this.state.counter + this.props.increment
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <h3 style={{ color: this.props.color, marginTop: this.props.marginTop }}>
        Last full reload: <mark>{this.state.counter}</mark> seconds ago
      </h3>
    );
  }
}
