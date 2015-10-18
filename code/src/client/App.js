import React from 'react';
import Component from 'react-pure-render/component';
import './app.scss';
import Row, {RowPure} from './atoms/Row.jsx'

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
      <h2 style={{ color: this.props.color }}>
        Counter ({this.props.increment}): {this.state.counter}
      </h2>
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
        <Row/>
        <div className="container">
          <div className="row">
            <div className="col-sm-2">
              Content
            </div>
            <div className="col-sm-2">
              Content long one <br/>
              Content long one
              Content long one
              Content long one
              Content long one
              Content long one
              Content long one
              Content long one
            </div>
          </div>
        </div>
        <RowPure name="Pure Cat"/>

        <Stateless name="Chandler" />
        <Counter increment={1} color="blueviolet" />
        <Counter increment={5} color="lightblue" />
        <Counter increment={3} color="lightgreen" />
      </div>
    );
  }
}
