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
      <h4 style={{ color: this.props.color }}>
        Counter ({this.props.increment}): {this.state.counter}
      </h4>
    );
  }
}


export class App extends Component { // eslint-disable-line react/no-multi-comp


  render() {
    const fontHeadingStyle = {
      fontWeight: '400',
      fontSize: '1rem',
      color: 'grey',
      borderBottom: '1px dashed lightgrey',
      paddingTop: '1rem',
      paddingBottom: '1rem',
      marginBottom: '1rem',
      minHeight: '2rem',
    };

    const headerText = 'Road Races in CA, 100mi range'
      .toUpperCase();

    const sampleText = `
      Dunnigan Hills Road Race
      64mi, 2h, 6814ft
      1234567890
      QWERTYqwerty Zz
      lb dl 6b illb
      Good job RCN rcn!
      Content long one
      Content long one
      Content long one`;

    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-sm-12 transparent">
              <h1 className="oswald">{headerText}</h1>
              <h1 className="montserrat">{headerText}</h1>
              <h1 className="merriweather">{headerText}</h1>
              {/*
              <h1 className="francois-one">{headerText}</h1>
              <h1 className="aleo">{headerText}</h1>
              */}
            </div>
          </div>
          <div className="row">
            <div className="col-sm-2 source-sans-pro">
              <div style={fontHeadingStyle}>Source Sans Pro (H3 A2)</div>
                {sampleText}
              </div>
              <div className="col-sm-2">
                <div style={fontHeadingStyle}>Lato (H2 A1)</div>
                {sampleText}
              </div>
              <div className="col-sm-2 roboto-condensed">
                <div style={fontHeadingStyle}>Roboto Condensed</div>
                {sampleText}
              </div>
              <div className="col-sm-2 alegreya-sans">
                <div style={fontHeadingStyle}>Alegreya Sans (H1 A3)</div>
                {sampleText}
              </div>
              <div className="col-sm-2 open-sans">
                <div style={fontHeadingStyle}>Open Sans (H3 A4)</div>
                {sampleText}
              </div>
              <div className="col-sm-2 roboto">
                <div style={fontHeadingStyle}>Roboto</div>
                {sampleText}
              </div>
          </div>
          <div className="row">
            <div className="col-sm-2 merriweather-sans">
              <div style={fontHeadingStyle}>Merriweather Sans</div>
              {sampleText}
            </div>
            <div className="col-sm-2 pt-sans">
              <div style={fontHeadingStyle}>PT Sans</div>
              {sampleText}
            </div>
          </div>
        </div>
        <br/>
        <Counter increment={1} color="lightblue" />
      </div>
    );
  }
}
