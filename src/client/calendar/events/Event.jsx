import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import Location from './Location.jsx'
import Typography from 'styles/typography'
import Colors from 'styles/colors'
import classNames from 'classnames'
import './Event.scss'
import Grid from 'styles/grid'
//import {rnd} from 'utils/math'
import {Disciplines} from 'temp/events'

export const EventName = (props) => {
  let className = classNames(`EventName size-${props.size} fix-fout`, props.className)
  let {name} = props
  const {typeColor} = props

  const createWrappedNameComponent = (name, stringToWrap, color) => {
    if (name && name.indexOf(stringToWrap) !== -1) {
      const parts = name.split(stringToWrap)
      return [parts[0], <span key={0} style={{color: color}}>{stringToWrap}</span>, parts[1]] //eslint-disable-line react/jsx-key
    }
    return name //TODO restuta: funtcion returns different types based on the flow, fix this
  }

  //TODO: make this production ready
  let wrappedNameComp = name
  wrappedNameComp = createWrappedNameComponent(name, 'Road Race', typeColor)
  wrappedNameComp = createWrappedNameComponent(wrappedNameComp, 'Criterium', typeColor)
  //wrappedNameComp = createWrappedNameComponent(wrappedNameComp, 'Crit', typeColor)
  wrappedNameComp = createWrappedNameComponent(wrappedNameComp, 'Circuit Race', typeColor)
  wrappedNameComp = createWrappedNameComponent(wrappedNameComp, 'Time Trial', typeColor)

  return (
    <div className={className}>
      {wrappedNameComp}
    </div>
  )
}

//gets height of the smallest card (in rems) for the given containerWidth
const getBaseHeight = containerWidth => {
  //for small containers there is no constant size we can compare to
  if (containerWidth < Grid.ContainerWidth.SM) {
    return 2
  }

  const baseHeightMap = {
    [Grid.ContainerWidth.SM]: 2,
    [Grid.ContainerWidth.MD]: 3,
    [Grid.ContainerWidth.LG]: 4,
    [Grid.ContainerWidth.XL]: 5,
    [Grid.ContainerWidth.XXL]: 6
  }

  return baseHeightMap[containerWidth]
}

class Event extends Component {
  render() {
    const {
      width,
      containerWidth,
      baseHeight = getBaseHeight(containerWidth),
      name,
      discipline
    } = this.props

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
      XXS: 'XXS',
      XS: 'XS',
      S: 'S',
      M: 'M',
      L: 'L',
      XL: 'XL'
    }

    const getSize = cardHeight => {
      if (cardHeight >= 1 && cardHeight <= 3) {
        return Size.XXS
      } else if (cardHeight >= 3 && cardHeight <= 5) {
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
    //TODO: move to CSS
    if (cardSize === Size.XXS) {
      verticalPadding = `${Typography.HALF_LINE_HEIGHT_REM / 2}rem`
      horizontalPadding = `${Typography.HALF_LINE_HEIGHT_REM / 2}rem`
      eventColor = 'black'
    } else if (cardSize === Size.XS) {
      verticalPadding = `${Typography.HALF_LINE_HEIGHT_REM / 2}rem`
      horizontalPadding = `${Typography.HALF_LINE_HEIGHT_REM / 2}rem`
      eventColor = 'orange'
    } else if (cardSize === Size.S) {
      verticalPadding = `${Typography.HALF_LINE_HEIGHT_REM / 2}rem`
      horizontalPadding = `${Typography.HALF_LINE_HEIGHT_REM / 2}rem`
      eventColor = 'tomato'
    } else if (cardSize === Size.M) {
      verticalPadding = `${Typography.HALF_LINE_HEIGHT_REM / 2 }rem`
      horizontalPadding = `${Typography.HALF_LINE_HEIGHT_REM}rem`
      eventColor = 'mediumseagreen'
    } else if (cardSize === Size.L) {
      verticalPadding = `${Typography.HALF_LINE_HEIGHT_REM}rem`
      horizontalPadding = `${Typography.HALF_LINE_HEIGHT_REM}rem`
      eventColor = 'darkorchid'
    } else if (cardSize === Size.XL) {
      verticalPadding = `${Typography.HALF_LINE_HEIGHT_REM + 1}rem`
      horizontalPadding = `${Typography.HALF_LINE_HEIGHT_REM + 1}rem`
      eventColor = 'deepskyblue'
    }

    const grid  = Grid.init(containerWidth)
    //2 compensates for calculation and round error, so card has no chance to push columns beyound it's width
    const cardWidthPx = Math.floor(grid.getColumnContentWidth(width)) - 2
    const cardWidthRem = Typography.pxToRem(cardWidthPx)


    // eventColor = ['orange', 'tomato', 'mediumseagreen', ' darkorchid', 'deepskyblue'][rnd(0, 4)]
    //eventColor = ['orange', 'tomato', 'mediumseagreen', ' darkorchid', 'deepskyblue'][width]

    if (discipline === Disciplines.MTB) {
      eventColor = Colors.brownMudDimmed
    }

    let style = {
      //backgroundColor: 'white',
      //width: cardWidthRem + 'rem',
      width: cardWidthPx + 'px',
      //width: '100%',
      height: cardHeightRem + 'rem',
      //height: '100%',
      paddingTop: verticalPadding,
      paddingBottom: verticalPadding,
      paddingLeft: horizontalPadding,
      paddingRight: horizontalPadding,
      borderLeft: `${cardWidthRem * 0.04}rem solid ${eventColor}`,
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

    const {event} = this.props

    return (
      <div style={style} className="Event lvl-1">
        {debugComponent}
        <EventName size={cardSize} name={name} typeColor={eventColor}/>
        <Location city={event.location.city} state={event.location.state} />
      </div>
    )
  }
}

Event.propTypes = {
  name: PropTypes.string,
  discipline: PropTypes.oneOf([Disciplines.MTB, Disciplines.Road]),
  //location: PropTypes.any,
  //width in coluns card is going to take
  width:  PropTypes.oneOf([1, 2, 3, 4]),
  //height of the smalles card in half-baselines
  baseHeight: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9]),
  //width of the container element to calculate card size in px
  containerWidth: PropTypes.number,
}

export default Event
