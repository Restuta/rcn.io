import React from 'react';
import Component from 'react-pure-render/component';
import './app.scss';

class Counter extends Component {
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
      <h1 style={{ color: this.props.color }}>
        Counter ({this.props.increment}): {this.state.counter}
      </h1>
    );
  }
}

const Stateless = (props) => {
//  shouldComponentUpdate = shouldPureComponentUpdate;
  const {name} = props;

  return <div>{name}</div>;
};


export class App extends Component { // eslint-disable-line react/no-multi-comp
  render() {
    return (
      <div>
        <h1 className="rcn">RCN
          <span className="nested"> is in the sky</span>
        </h1>
        Phoebe, 124
        <Stateless name="Chandler" />
        <Counter increment={1} color="blueviolet" />
        <Counter increment={5} color="lightblue" />
        <Counter increment={3} color="lightgreen" />
      </div>
    );
  }
}
