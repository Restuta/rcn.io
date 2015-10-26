import React from 'react';
import Component from 'react-pure-render/component';
import './app.scss';
import Row from './atoms/Row.jsx';


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
        Last full reload: <mark>{this.state.counter}</mark> seconds ago
      </h3>
    );
  }
}

function getRandomNum(from, to) {
  return Math.floor(Math.random() * to) + from;
}

const UpdatesComponent = () => <div className="updates"></div>;

export class App extends Component { // eslint-disable-line react/no-multi-comp
  constructor(props) {
    super(props);
    this.state = {
      cols: [{
        value: 0,
        updates: 0
      }],
      lastNum: 0,
      operation: ''
    };
    const additionRate = 5000;
    const updateRate = 200;

    setInterval(() => {
      const nextNum = this.state.lastNum + 1;
      let newCols = this.state.cols.concat([{value: nextNum, updates: 0}]);

      this.setState({
        lastNum: nextNum,
        cols: newCols,
        operation: 'add'
      });
    }, additionRate);

    setInterval(() => {
      const nextNum = this.state.lastNum;

      let newCols = this.state.cols.concat([]);
      let randomIndex = getRandomNum(0, newCols.length);

      let newUpdates = ++newCols[randomIndex].updates;

      newCols[randomIndex] = {
        value: newCols[randomIndex].value,
        updates: newUpdates
      };

      this.setState({
        lastNum: nextNum,
        cols: newCols,
        operation: 'update'
      });
    }, updateRate);
  }

  componentWillUpdate() {
    this.startTimeMs = +new Date();
  }

  componentDidUpdate() {
    let currentMs = +new Date();
    const deltaMs = (currentMs - this.startTimeMs);

    if (deltaMs < 100) {
      return;
    }

    let msg = this.state.operation + ': ' + deltaMs + 'ms, components:  ' + this.state.cols.length;
    //let msg = deltaMs + ', ' + this.state.cols.length;

    if (this.state.operation === 'update') {
      msg = '  ' + msg;
    };

    console.log(msg);
  }

  render() {
    let columns = [];

    for (let i = 0; i < this.state.cols.length; i++) {
      const value = this.state.cols[i].value;
      const updates = this.state.cols[i].updates;

      if (updates > 0) {
        const updatesComponents = [];

        for (let k = 0; k < updates; k++) {
          updatesComponents.push(<UpdatesComponent key={k}/>);
        }

        columns.push(
          <div key={i} className="col-sm-1 marked">
            {updatesComponents}
          </div>);
      } else {
        columns.push(
          <div key={i} className="col-sm-1">{value}</div>
        );
      }
    }

    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-sm-12 transparent">
              <h1 className="oswald">Road Races in CA, 100mi range</h1>
            </div>
          </div>
          <Row className="bla">
            {columns}
          </Row>
        </div>
        {/*<Counter increment={1} color="silver" marginTop="20px" /> */}
      </div>
    );
  }
}
