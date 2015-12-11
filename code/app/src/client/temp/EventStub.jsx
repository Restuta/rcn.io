import React from 'react';
import Component from 'react-pure-render/component';
import Typography from '../styles/typography';
import Colors from '../styles/colors';
import classNames from 'classnames';
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

    this.onResize(); //calculate for the very first time
    //handling windw resize to recalculate components windth and re-render
    window.addEventListener('resize', this.onResize.bind(this));
  }

  onResize() {
    this.setState({ //eslint-disable-line
      width: this.div.offsetWidth
    });
  }

  render() {
    const heightInIdealRems = Typography.roundToIdealRems(this.state.width / 1.618)
      //- Typography.LINE_HEIGHT_REM;

    const style = {
      height: heightInIdealRems + 'rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      flexWrap: 'wrap',
      fontSize: Typography.scaleDown(2) + 'rem',
    };

    const widthStyle = {
      marginTop: '3px',
      borderTop: '1px solid black'
    };

    const heightStyle = {
      alignSelf: 'flex-start',
      marginLeft: 3,
      paddingLeft: 3,
      borderLeft: '1px solid black'
    };

    const ratioStyle = {
      color: Colors.greyLvl30
    };
    const baseLinesStyle = {
      alignSelf: 'flex-end',
      paddingRight: 3,
      color: 'lightslategrey'
    }

    const roundedHeight = heightInIdealRems * Typography.BASE_FONT_SIZE_PX;
    const roundedWidth = this.state.width;
    const heightInBaseLines = Math.round(heightInIdealRems / Typography.LINE_HEIGHT_REM);

    const className = classNames('EventStub', this.props.className);

    return (
      <div style={style} ref={(x) => this.div = x} className={className}>
        <span style={widthStyle}>{roundedWidth}</span>
        <span style={heightStyle}>{roundedHeight}</span>
        <span style={ratioStyle}>{(roundedWidth / roundedHeight).toFixed(4)}</span>
        <span style={baseLinesStyle}>{heightInBaseLines}</span>
      </div>
    );
  }
}
