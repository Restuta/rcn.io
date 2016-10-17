import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import Location from './Location.jsx'
import Typography from 'styles/typography'
import Colors from 'styles/colors'
import './Event.scss'
import Grid from 'styles/grid'
import { Disciplines } from 'calendar/events/types'
import { getEventColor } from 'calendar/utils/event-colors.js'
import Size from './card-sizes'
import EventName from './EventName.jsx'
import IconLabel from './IconLabel.jsx'
import { withRouter } from 'react-router'
import Icon from 'atoms/Icon.jsx'
import classnames from 'classnames'
import { Statuses } from 'client/calendar/events/types.js'

/* event card adaptive behaviour:
   >= 300 fit two
   <= 299 fit one and stretch
   Can control card with in manual mode, height set to auto
*/

/*
Event sizing types:
  - fixed width, calculates width itself based on container and colSize (for cases like Dev)
  - fixed width, arbitrary, set from outside, assumes to colSize is set (for widgets)
  - non-fixed with, takes 100% of it's container (for regular calendar)
*/


//gets height of the smallest card (in rems) for the given containerWidth
const getBaseHeight = containerWidth => {
  //for small containers there is no constant size we can compare to
  if (containerWidth < Grid.ContainerWidth.SM) {
    return 2
  }

  let baseHeight

  if (containerWidth <= Grid.ContainerWidth.SM) {
    baseHeight = 2
  } else if (containerWidth > Grid.ContainerWidth.SM && containerWidth <= Grid.ContainerWidth.MD) {
    baseHeight = 3
  } else if (containerWidth > Grid.ContainerWidth.MD && containerWidth <= Grid.ContainerWidth.LG) {
    baseHeight = 4
  } else if (containerWidth > Grid.ContainerWidth.LG && containerWidth <= Grid.ContainerWidth.XL) {
    baseHeight = 5
  } else if (containerWidth > Grid.ContainerWidth.XL) {
    baseHeight = 6
  }

  return baseHeight
}

//get specific to container and column size cardWidth
const getCardWithInRems = (containerWidth, widthColumns) => {
  const grid  = Grid.init(containerWidth)
  //"2" compensates for calculation and round error, so card has no chance to push columns beyound it's widthColumns
  const cardWidthPx = Math.floor(grid.getColumnContentWidth({numberOfCols: widthColumns})) - 2
  return Typography.pxToRem(cardWidthPx)
}


//nummeric card sizes for simple comparisons
const numSize = {
  [Size.XXS]: 0,
  [Size.XS]: 10,
  [Size.S]: 20,
  [Size.M]: 30,
  [Size.L]: 40,
  [Size.XL]: 50
}

class Event extends Component {
  constructor(props) {
    super(props)
    this.onEventClick = this.onEventClick.bind(this)
  }

  onEventClick(e) {
    //so link doesn't redirect to whatever set in href, but is still indexable with google
    e.preventDefault()

    const trackClick = () => analytics.track('Clicked on Event', {
      id: this.props.event.id,
      name: this.props.event.name,
      date: this.props.event.date.format('MMMM DD YYYY'),
      type: this.props.event.type,
      discipline: this.props.event.discipline,
    })

    trackClick()

    this.props.router.replace({
      pathname: `/events/${this.props.id}`,
      state: {
        modal: true,
        returnLocation: {
          pathname: this.context.locationPathname,
        },
      }
    })
  }

  render() {
    const {
      widthColumns,
      containerWidth,
      autoHeight = false,
      baseHeight = getBaseHeight(containerWidth),
      name,
      fixedWidth = false,
      width = '100%',
      event = {location: {
        city: '',
        state: ''
      }},
      draft = false,
    } = this.props

    const classNames = classnames('Event lvl-1', {
      'canceled': event.status === Statuses.canceled,
      'moved': event.status === Statuses.moved
    })

    //TODO: typography should be passed as props
    /*
    following formula can be expressed as:

    function sizeFor(cols, minHeight) {
      const a = minHeight
      const c = cols
      return  c*a + c - 1
    }

    it calculates card height so it's twice as tall as two previous sizes + margins
    XS: 2-5, S: 5-9, M: 10-15, L: 16-23+
    */

    const cardHeight = autoHeight
      ? 12 //TODO: default size doesn't make sense here, but we need to calculate card size somehow
      : (widthColumns * baseHeight + widthColumns - 1)

    const getSize = cardHeight => {
      if (cardHeight >= 1 && cardHeight <= 3) {
        return Size.XXS
      } else if (cardHeight >= 3 && cardHeight <= 5) {
        return Size.XS
      } else if (cardHeight >= 6 && cardHeight <= 8) {
        return Size.S
      } else if (cardHeight >= 9 && cardHeight <= 11) {
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
    let paddingBottom
    let paddingTop
    let eventColor = 'white'
    let locationComponent = null

    //differnt settings based on card size
    //TODO: move to CSS
    if (cardSize === Size.XXS) {
      verticalPadding = `${Typography.pxToRem(1)}rem`
      horizontalPadding = `${Typography.pxToRem(1)}rem`
      eventColor = 'black'
    } else if (cardSize === Size.XS) {
      verticalPadding = `${Typography.HALF_LINE_HEIGHT_REM / 4}rem`
      horizontalPadding = `${Typography.HALF_LINE_HEIGHT_REM / 2}rem`
      eventColor = 'orange'
    } else if (cardSize === Size.S) {
      verticalPadding = `${Typography.HALF_LINE_HEIGHT_REM / 2}rem`
      horizontalPadding = `${Typography.HALF_LINE_HEIGHT_REM / 2}rem`
      eventColor = 'tomato'
    } else if (cardSize === Size.M) {
      paddingTop = `${Typography.HALF_LINE_HEIGHT_REM / 2}rem`
      //paddingBottom = `${Typography.HALF_LINE_HEIGHT_REM}rem`
      horizontalPadding = `${Typography.HALF_LINE_HEIGHT_REM}rem`
      eventColor = 'mediumseagreen'
    } else if (cardSize === Size.L) {
      paddingTop = `${Typography.HALF_LINE_HEIGHT_REM}rem`
      //paddingBottom = `${Typography.HALF_LINE_HEIGHT_REM}rem`
      horizontalPadding = `${Typography.HALF_LINE_HEIGHT_REM}rem`
      eventColor = 'darkorchid'
    } else if (cardSize === Size.XL) {
      paddingTop = `${Typography.HALF_LINE_HEIGHT_REM + 1}rem`
      //paddingBottom = `${Typography.HALF_LINE_HEIGHT_REM + 1}rem`
      horizontalPadding = `${Typography.HALF_LINE_HEIGHT_REM + 1}rem`
      eventColor = 'deepskyblue'
    }


    const { debug = false } = this.props

    if (!debug) {
      eventColor = getEventColor(event.discipline, event.type, event.status) || eventColor
    }

    let debugComponent = null

    if (debug) {
      debugComponent = (<span style={{
        position: 'absolute',
        fontSize: '1.25rem',
        top: '-8px',
        right: '5%',
        whiteSpace: 'nowrap',
        color: Colors.grey400,
        overflow: 'visible',
      }}>{cardSize} {cardHeightRem} </span>)
    }

    // const grid  = Grid.init(containerWidth)
    //2 compensates for calculation and round error, so card has no chance to push columns beyound it's widthColumns
    // const cardWidthPx = Math.floor(grid.getColumnContentWidth({numberOfCols: widthColumns})) - 2
    // const cardWidthRem = Typography.pxToRem(cardWidthPx)

    // const cardWidthRem = Math.round(cardHeightRem * 1.618)
    let cardWidthRem

    // const cardWidth = fixedWidth ? (cardWidthRem + 'rem') : ('100%')
    // const cardWidth = '100%'
    let cardWidth

    if (fixedWidth && widthColumns) {
      cardWidthRem = getCardWithInRems(containerWidth, widthColumns)
      cardWidth = cardWidthRem + 'rem'
    } else if (fixedWidth) {
      //TODO: in fixedWith case this is used for left border calculation only
      cardWidthRem = Math.round(cardHeightRem * 1.618)
      cardWidth = width
    } else {
      cardWidthRem = getCardWithInRems(containerWidth, widthColumns)
      cardWidth = cardWidthRem + 'rem'
    }

    let eventGroupComponent = null

    if (event.group) {
      eventGroupComponent = (<span style={{
        position: 'absolute',
        fontFamily: 'museo-sans-condensed',
        fontWeight: '500',
        textTransform: 'uppercase',
        fontSize: Typography.pxToRem(11) + 'rem',
        top: '-1rem',
        left: '1rem',
        whiteSpace: 'nowrap',
        color: Colors.grey500,
      }}>G {event.group} </span>)
    }

    let promoterComp = null

    if ((numSize[cardSize] > numSize[Size.S]) && !draft) {
      locationComponent = <Location location={event.location} size={cardSize} />
    } else if ((numSize[cardSize] > numSize[Size.S]) && draft) {
      const promoter = event.promoters[0].name
      promoterComp = (
        <IconLabel style={{borderTop: `1px solid ${Colors.grey200}`}} icon="face" size={cardSize}>
          {promoter}
        </IconLabel>
      )
    }

    let style = {
      opacity: 1,
      //width: cardWidthRem + 'rem',
      //width: cardWidthPx + 'px',
      // width: fixedWidth ? cardWidth : (cardWidthRem + 'rem'),
      width: cardWidth,
      height: autoHeight ? 'auto' : cardHeightRem + 'rem',
      // height: cardHeightRem + 'rem',
      // height: 4 + 'rem',
      // height: '100%',
      // minHeight: 2 + 'rem',
      // maxHeight: cardHeightRem * 2 + 'rem',

      paddingTop: paddingTop || verticalPadding,
      paddingBottom: paddingBottom || verticalPadding,
      paddingLeft: horizontalPadding,
      paddingRight: horizontalPadding,
      borderLeft: `${cardWidthRem * 0.04}rem solid ${eventColor}`,
      //we use outside of the edge elements for debug mode and for draft (event groups)
      overflow: (event.group || debug) ? 'visible' : 'hidden',
    }

    return (
      <a id={event.id} href={`/events/${this.props.id}`} style={style} className={classNames}
        onClick={this.onEventClick}>
        {debugComponent}

        <EventName size={cardSize} height={cardHeightRem} name={name} type={event.type}
          typeColor={eventColor} eventStatus={event.status}/>

        {event.notes && <Icon name="speaker_notes" className="icon" color={eventColor}/>}
        {eventGroupComponent}
        {locationComponent}
        {promoterComp}
      </a>
    )
  }
}

Event.propTypes = {
  //TODO bc: id, name and discipline are covered under "event type"
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  //debug mode for the card
  debug: PropTypes.bool,
  //if false, card wouuld take 100% of the container (default) and ignore widthProp
    //if true uses provided with or 100% if none
  fixedWidth: PropTypes.bool,
  //allows external control of card with (px, %, rem or any css values), requires fixedWidth to  be true
  width: PropTypes.string,
  //width in columns card is going to take
  widthColumns:  PropTypes.oneOf([1, 2, 3, 4]).isRequired,
  //if true, card will adjust it's height based on it's content, if false it would calculate size according to columns
    //layout formula, use it with combination of maxHeight
  autoHeight: PropTypes.bool,
  //height of the smalles card in half-baselines
  baseHeight: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9]),
  //width of the container element to calculate card size in px
  containerWidth: PropTypes.number,
  // event: PropTypes.instanceOf(EventType),
  //TODO bc: probably move props to upper level or move event-related props to down level
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    date: PropTypes.object.isRequired,
    datePlain: PropTypes.string.isRequired,
    type: PropTypes.string,
    discipline: PropTypes.oneOf(Object
      .keys(Disciplines)
      .map(x => Disciplines[x])
      //.concat([''])
    ),
    location: PropTypes.shape({
      city: PropTypes.string,
      state: PropTypes.string,
      zip: PropTypes.string,
    }),
    promoterUrl: PropTypes.string,
    registrationUrl: PropTypes.string,
    flyerUrl: PropTypes.string,
    status: PropTypes.string,
    notes: PropTypes.string,
  }),
  draft: PropTypes.bool,
}

Event.contextTypes = {
  locationPathname: React.PropTypes.string
}

export default withRouter(Event)
