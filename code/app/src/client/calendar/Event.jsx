import React, {PropTypes} from 'react';
import Component from 'react-pure-render/component';
import Typography from '../styles/typography';
import Colors from '../styles/colors';
import classNames from 'classnames';
import './Event.scss';

export class EventName extends Component {
  render() {
    const className = classNames('EventName', this.props.className);

    return (
      <div className={className}>{this.props.children}</div>
    );
  }
}

export class RoundBadge extends Component {
  render() {
    const {size = 1} = this.props;
    const className = size === 2
      ? classNames('RoundBadge x2', this.props.className)
      : classNames('RoundBadge', this.props.className);

    return (
      <div className={className}>
        {this.props.children}
      </div>
    );
  }
}

export class Badge extends Component {
  render() {
    const className = classNames('Badge', this.props.className);

    return (
      <span className={className}>
        {this.props.children}
      </span>
    );
  }
}

export class SquareBadge extends Component {
  render() {
    const className = classNames('Badge SquareBadge', this.props.className);

    return (
      <span className={className}>
        {this.props.children}
      </span>
    );
  }
}

class Event extends Component {
  render() {
    const widthPx = this.props.width || 50;
    //todo: typography should be passed as props
    const idealHeightRem = Typography.roundToIdealRems(widthPx / 1.5);
    const verticalPadding = `${Typography.HALF_LINE_HEIGHT_REM}rem`;
    const horizontalPadding = `${Typography.HALF_LINE_HEIGHT_REM}rem`;

    const borderWidth = Math.round((widthPx / 30) * (widthPx / 30));

    let style = {
      width: widthPx + 'px',
      height: idealHeightRem + 'rem',
      paddingTop: verticalPadding,
      paddingBottom: verticalPadding,
      paddingLeft: horizontalPadding,
      paddingRight: horizontalPadding,
      borderLeft: `${borderWidth}px solid ${Colors.grey600}`,
    };

    return (
      <div style={style} ref={(x) => this.div = x} className="Event lvl-1">
        <EventName>{this.props.name}</EventName>
      </div>
    );
  }
}

Event.propTypes = {
  name: PropTypes.string,
  width: PropTypes.number
};

//export default Event;

//----
//below is debugging code

//HOC to wrap a componennt in a debugging one
let DebugComponent = ComponentToDebug => props => {
  const lineHeightRem = Typography.HALF_LINE_HEIGHT_REM;
  const debugColor = 'rgb(238, 247, 228)';

  const topBoxShadow = `inset 0px ${lineHeightRem}rem 0px 0px ${debugColor}`;
  const bottomBoxShadow = `inset 0px ${-lineHeightRem}rem 0px 0px ${debugColor}`;
  const leftBoxShadow = `inset ${lineHeightRem}rem 0px 0px 0px ${debugColor}`;
  const rightBoxShadow = `inset ${-lineHeightRem}rem 0px 0px 0px ${debugColor}`;

  const styles = {
    boxShadow: `${topBoxShadow},${bottomBoxShadow},${leftBoxShadow},${rightBoxShadow}`
  };

  return (
    <div style={styles}>
      <ComponentToDebug {...props}/>
    </div>
  );
};

export default DebugComponent(Event);
//export default Event;
