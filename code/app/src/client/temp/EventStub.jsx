import React from 'react';
import Component from 'react-pure-render/component';
import Typography from '../styles/typography';
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
    this.setState({ //eslint-disable-line
      width: this.div.offsetWidth,
      height: Math.round(this.div.offsetWidth / 1.618)
    });

    //handling windw resize to recalculate components windth and re-render
    window.addEventListener('resize', this.onResize.bind(this));
  }

  onResize() {
    this.setState({ //eslint-disable-line
      width: this.div.offsetWidth,
      height: Math.round(this.div.offsetWidth / 1.618)
    });
  }

  render() {
    const style = {
      height: this.state.height + 'px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontSize: Typography.scaleUp(1) + 'rem',
    };

    const widthStyle = {}

    const heightStyle = {
      alignSelf: 'flex-start',
      paddingLeft: 3
    }

    const roundedHeight = Math.round(this.state.height);
    const roundedWidth = this.state.width;

    return (
      <div style={style} ref={(x) => this.div = x} className="EventStub"  onResize = {this.onResize}>
        <span style={widthStyle}>{roundedWidth}</span>
        <span style={heightStyle}>{roundedHeight}</span>
      </div>
    );
  }
}
