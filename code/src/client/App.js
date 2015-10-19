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
      <h3 style={{ color: this.props.color, marginTop: this.props.marginTop }}>
        Last full reload ({this.props.increment}): <mark>{this.state.counter}</mark> seconds ago
      </h3>
    );
  }
}


export class App extends Component { // eslint-disable-line react/no-multi-comp
  render() {
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-sm-12 transparent">
              <h1 className="oswald">Road Races in CA, 100mi range</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-2">1</div>
            <div className="col-sm-2">2</div>
            <div className="col-sm-2">3</div>
            <div className="col-sm-2">4</div>
            <div className="col-sm-2">5</div>
            <div className="col-sm-2">6</div>
          </div>
        </div>
        <Counter increment={1} color="silver" marginTop="20px" />
      </div>
    );
  }
}
