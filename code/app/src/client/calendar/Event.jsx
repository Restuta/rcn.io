import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import Typography from '../styles/typography'
import Colors from '../styles/colors'
import classNames from 'classnames'
import './Event.scss'
import Grid from '../styles/grid'

export class EventName extends Component {
  render() {
    let className = classNames(`EventName size-${this.props.size}`, this.props.className)

    return (
      <div className={className}>
        {this.props.children}
      </div>
    )
  }
}

class Event extends Component {
  render() {
    const {width, baseHeight, containerWidth} = this.props
    //todo: typography should be passed as props

    let verticalPadding
    let horizontalPadding

    //differnt settings based on card size
    if (width === 1) {
      verticalPadding = `${Typography.HALF_LINE_HEIGHT_REM / 2}rem`
      horizontalPadding = `${Typography.HALF_LINE_HEIGHT_REM / 2}rem`
    } else {
      verticalPadding = `${Typography.HALF_LINE_HEIGHT_REM}rem`
      horizontalPadding = `${Typography.HALF_LINE_HEIGHT_REM}rem`
    }

    const grid  = Grid.init(containerWidth)
    const cardWidthPx = grid.getColumnContentWidth(width)
    /*
    following formula can be expressed as:

    function sizeFor(cols, minHeight) {
      const a = minHeight
      const c = cols
      return  c*a + c - 1
    }

    it calculates card height so it's twice taller than two previous sizes + margins
    */
    const cardHeight = (width * baseHeight + width - 1)
    const cardHeightRem = cardHeight * Typography.HALF_LINE_HEIGHT_REM

    let style = {
      width: cardWidthPx + 'px',
      height: cardHeightRem + 'rem',
      paddingTop: verticalPadding,
      paddingBottom: verticalPadding,
      paddingLeft: horizontalPadding,
      paddingRight: horizontalPadding,
      borderLeft: `${cardWidthPx * 0.06}px solid ${Colors.grey600}`,
    }

    return (
      <div style={style} className="Event lvl-1">
        <span style={{
          position: 'absolute',
          top: '-8px',
          left: '85%',
          color: Colors.grey400,
        }}>{cardHeightRem}</span>
        <EventName size={width}>{this.props.name}</EventName>
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
// let DebugComponent = ComponentToDebug => props => {
//   const lineHeightRem = Typography.HALF_LINE_HEIGHT_REM
//   const debugColor = 'rgb(238, 247, 228)'
//
//   const topBoxShadow = `inset 0px ${lineHeightRem}rem 0px 0px ${debugColor}`
//   const bottomBoxShadow = `inset 0px ${-lineHeightRem}rem 0px 0px ${debugColor}`
//   const leftBoxShadow = `inset ${lineHeightRem}rem 0px 0px 0px ${debugColor}`
//   const rightBoxShadow = `inset ${-lineHeightRem}rem 0px 0px 0px ${debugColor}`
//
//   const styles = {
//     boxShadow: `${topBoxShadow},${bottomBoxShadow},${leftBoxShadow},${rightBoxShadow}`
//   }
//
//   return (
//     <div style={styles}>
//       <ComponentToDebug {...props}/>
//     </div>
//   )
// }

//export default DebugComponent(Event)
export default Event
