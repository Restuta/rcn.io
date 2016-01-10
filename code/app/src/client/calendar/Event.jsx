import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import Typography from '../styles/typography'
import Colors from '../styles/colors'
import classNames from 'classnames'
import './Event.scss'
import Grid from '../styles/grid'

export class EventName extends Component {
  render() {
    const className = classNames('EventName', this.props.className)

    return (
      <div className={className}>{this.props.children}</div>
    )
  }
}

export class RoundBadge extends Component {
  render() {
    const {size = 1} = this.props
    const className = size === 2
      ? classNames('RoundBadge x2', this.props.className)
      : classNames('RoundBadge', this.props.className)

    return (
      <div className={className}>
        {this.props.children}
      </div>
    )
  }
}

export class Badge extends Component {
  render() {
    const className = classNames('Badge', this.props.className)

    return (
      <span className={className}>
        {this.props.children}
      </span>
    )
  }
}

export class SquareBadge extends Component {
  render() {
    const className = classNames('Badge SquareBadge', this.props.className)

    return (
      <span className={className}>
        {this.props.children}
      </span>
    )
  }
}

class Event extends Component {
  render() {
    //const widthPx = this.props.width || 50
    //todo: typography should be passed as props
    const verticalPadding = `${Typography.HALF_LINE_HEIGHT_REM}rem`
    const horizontalPadding = `${Typography.HALF_LINE_HEIGHT_REM}rem`

    //const borderWidth = Math.round((widthPx / 30) * (widthPx / 30))

    const {width, baseHeight, containerWidth} = this.props
    const grid  = Grid.init(containerWidth)
    const cardWidthPx = grid.getColumnContentWidth(width)
    //TODO bc: explain this formula
    const cardHeight = (width * baseHeight + width - 1)
    const cardHeightRem = cardHeight * Typography.HALF_LINE_HEIGHT_REM

    let style = {
      width: cardWidthPx + 'px',
      height: cardHeightRem + 'rem',
      paddingTop: verticalPadding,
      paddingBottom: verticalPadding,
      paddingLeft: horizontalPadding,
      paddingRight: horizontalPadding,
      borderLeft: `${cardWidthPx / 8 * width / 1.618}px solid ${Colors.grey600}`,
    }

    return (
      <div style={style} className="Event lvl-1">
        <EventName>{this.props.name}</EventName>
      </div>
    )
  }
}

Event.propTypes = {
  name: PropTypes.string,
  //width in coluns card is going to take
  width:  React.PropTypes.oneOf([1, 2, 3, 4]),
  //height of the smalles card in half-baselines
  baseHeight: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9]),
  //width of the container element to calculate card size in px
  containerWidth: PropTypes.number,
}

//export default Event;

//----
//below is debugging code

//HOC to wrap a componennt in a debugging one
let DebugComponent = ComponentToDebug => props => {
  const lineHeightRem = Typography.HALF_LINE_HEIGHT_REM
  const debugColor = 'rgb(238, 247, 228)'

  const topBoxShadow = `inset 0px ${lineHeightRem}rem 0px 0px ${debugColor}`
  const bottomBoxShadow = `inset 0px ${-lineHeightRem}rem 0px 0px ${debugColor}`
  const leftBoxShadow = `inset ${lineHeightRem}rem 0px 0px 0px ${debugColor}`
  const rightBoxShadow = `inset ${-lineHeightRem}rem 0px 0px 0px ${debugColor}`

  const styles = {
    boxShadow: `${topBoxShadow},${bottomBoxShadow},${leftBoxShadow},${rightBoxShadow}`
  }

  return (
    <div style={styles}>
      <ComponentToDebug {...props}/>
    </div>
  )
}

//export default DebugComponent(Event)
export default Event;
