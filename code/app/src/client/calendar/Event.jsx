import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import Typography from 'styles/typography'
import Colors from 'styles/colors'
import classNames from 'classnames'
import './Event.scss'
import Grid from 'styles/grid'

export const EventName = (props) => {
  let className = classNames(`EventName size-${props.size}`, props.className)
  return (
    <div className={className}>
      {props.children}
    </div>
  )
}

class Event extends Component {
  render() {
    const {width, baseHeight, containerWidth} = this.props
    //todo: typography should be passed as props

    /*
    following formula can be expressed as:

    function sizeFor(cols, minHeight) {
      const a = minHeight
      const c = cols
      return  c*a + c - 1
    }

    it calculates card height so it's twice taller than two previous sizes + margins
    XS: 2-5, S: 5-9, M: 10-15, L: 16-23+
    */
    const cardHeight = (width * baseHeight + width - 1)

    const Size = {
      XS: 'XS',
      S: 'S',
      M: 'M',
      L: 'L',
      XL: 'XL'
    }

    const getSize = cardHeight => {
      if (cardHeight >= 1 && cardHeight <= 5) {
        return Size.XS
      } else if (cardHeight >= 6 && cardHeight <= 9) {
        return Size.S
      } else if (cardHeight >= 10 && cardHeight <= 11) {
        return Size.M
      } else if (cardHeight >= 12 && cardHeight <= 17) {
        return Size.L
      } else if (cardHeight >= 18) {
        return Size.XL
      }
    }

    const cardSize = getSize(cardHeight)
    const cardHeightRem = cardHeight * Typography.HALF_LINE_HEIGHT_REM

    let verticalPadding
    let horizontalPadding
    let eventColor = 'white'

    //differnt settings based on card size
    if (cardSize === Size.XS) {
      verticalPadding = `${Typography.HALF_LINE_HEIGHT_REM / 4}rem`
      horizontalPadding = `${Typography.HALF_LINE_HEIGHT_REM / 4}rem`
      eventColor = 'gold'
    } else if (cardSize === Size.S) {
      verticalPadding = `${Typography.HALF_LINE_HEIGHT_REM / 2}rem`
      horizontalPadding = `${Typography.HALF_LINE_HEIGHT_REM / 2}rem`
      eventColor = 'tomato'
    } else if (cardSize === Size.M) {
      verticalPadding = `${Typography.HALF_LINE_HEIGHT_REM}rem`
      horizontalPadding = `${Typography.HALF_LINE_HEIGHT_REM}rem`
      eventColor = 'limegreen'
    } else if (cardSize === Size.L) {
      verticalPadding = `${Typography.HALF_LINE_HEIGHT_REM}rem`
      horizontalPadding = `${Typography.HALF_LINE_HEIGHT_REM}rem`
      eventColor = 'blueviolet'
    } else if (cardSize === Size.XL) {
      verticalPadding = `${Typography.HALF_LINE_HEIGHT_REM + 1}rem`
      horizontalPadding = `${Typography.HALF_LINE_HEIGHT_REM + 1}rem`
      eventColor = 'deepskyblue'
    }

    const grid  = Grid.init(containerWidth)
    const cardWidthPx = grid.getColumnContentWidth(width)
    eventColor = Colors.grey600

    let style = {
      //backgroundColor: 'white',
      width: cardWidthPx + 'px',
      height: cardHeightRem + 'rem',
      paddingTop: verticalPadding,
      paddingBottom: verticalPadding,
      paddingLeft: horizontalPadding,
      paddingRight: horizontalPadding,
      borderLeft: `${cardWidthPx * 0.06}px solid ${eventColor}`,
    }

    const {debug = false} = this.props
    let debugComponent = null

    if (debug) {
      debugComponent = (<span style={{
        position: 'absolute',
        top: '-8px',
        left: '85%',
        color: Colors.grey400,
      }}>{cardHeightRem}</span>)
    }

    return (
      <div style={style} className="Event lvl-1">
        {debugComponent}
        <EventName size={cardSize}>{this.props.name}</EventName>
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

export default Event
