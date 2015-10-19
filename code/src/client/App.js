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
    const fontHeadingStyle = {
        backgroundColor: 'pink',
        paddingLeft: '15px',
        marginLeft: '-15px',
        marginRight: '-15px'
    };

    return (
      <div>
        <h1 className="oswald">Events in California</h1>
        <h1 className="montserrat">Events in California</h1>
        <h1 className="playfair">Events in California</h1>
        <h1 className="alegreya">Events in California</h1>

        <div className="container">
          <div className="row">
          <div className="col-sm-2 source-sans-pro">
            <div style={fontHeadingStyle}>Source Sans Pro (H3 A2)</div>
              Dunnigan Hills Road Race
              64mi, 2h, 6200ft
              1234567890
              QWERTYqwerty
              lb dl 6b illb
              Good job RCN rcn!
              Content long one
              Content long one
              Content long one
            </div>
            <div className="col-sm-2">
              <div style={fontHeadingStyle}>Lato (H2 A1)</div>
              Dunnigan Hills Road Race
              64mi, 2h, 6200ft
              1234567890
              QWERTYqwerty
              lb dl 6b illb
              Good job RCN rcn!
              Content long one
              Content long one
              Content long one
            </div>
            <div className="col-sm-2 work-sans">
              <div style={fontHeadingStyle}>Work Sans (H5 A5)</div>
              Dunnigan Hills Road Race
              64mi, 2h, 6200ft
              1234567890
              QWERTYqwerty
              lb dl 6b illb
              Good job RCN rcn!
              Content long one
              Content long one
              Content long one
            </div>
            <div className="col-sm-2 alegreya-sans">
              <div style={fontHeadingStyle}>Alegreya Sans (H1 A3)</div>
              Dunnigan Hills Road Race
              64mi, 2h, 6200ft
              1234567890
              QWERTYqwerty
              lb dl 6b illb
              Good job RCN rcn!
              Content long one
              Content long one
              Content long one
            </div>
            <div className="col-sm-2 open-sans">
              <div style={fontHeadingStyle}>Open Sans (H3 A4)</div>
              Dunnigan Hills Road Race
              64mi, 2h, 6200ft
              1234567890
              QWERTYqwerty Zz
              lb dl 6b illb
              Good job RCN rcn!
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
