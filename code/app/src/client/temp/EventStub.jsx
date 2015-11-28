import React from 'react';
import Component from 'react-pure-render/component';
import './EventStub.scss';

export default class EventStub extends Component {
  constructor(props) {
    super(props);
    this.state = {height: 50};
  }

  componentDidMount() {
    //TODO: this is used to get actual size from the browser after component is rendred and results in second react-pure-render
    //we can avoid this by moving that into top-level HOC that first gets size of the browser window and then renders children
    //into it passing actual size, so only topmost component would be rendred twice, which is few ms
    this.setState({height: this.div.offsetWidth / 1.618}); //eslint-disable-line 
  }

  render() {
    let style = {
      height: this.state.height + 'px'
    };

    return (
      <div style={style} ref={(x) => this.div = x} className="EventStub"></div>
    );
  }
};
