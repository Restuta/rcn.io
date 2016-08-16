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

  onEventClick() {
    const trackClick = () => analytics.track('Clicked on Event', {
      event: this.props.event,
    })

    trackClick()

    this.props.router.push({
      pathname: `/events/${this.props.id}`,
      state: { modal: true, returnUrl: this.context.locationPathname}
    })
  }

  render() {
    // console.info('Event render')

    const {
      width,
      containerWidth,
      baseHeight = getBaseHeight(containerWidth),
      name,
      event = {location: {
        city: '',
        state: ''
      }},
      draft = false,
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

    const grid  = Grid.init(containerWidth)
    //2 compensates for calculation and round error, so card has no chance to push columns beyound it's width
    const cardWidthPx = Math.floor(grid.getColumnContentWidth(width)) - 2
    const cardWidthRem = Typography.pxToRem(cardWidthPx)

    eventColor = getEventColor(event.discipline, event.type, event.status) || eventColor

    const { debug = false } = this.props
    let debugComponent = null

    if (debug) {
      debugComponent = (<span style={{
        position: 'absolute',
        fontSize: '1.25rem',
        top: '-8px',
        left: '80%',
        whiteSpace: 'nowrap',
        color: Colors.grey400,
      }}>{cardSize} {cardHeightRem} </span>)
    }

    const cardWidth = debug ? (cardWidthPx + 'px') : ('100%')

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
      promoterComp = (
        <IconLabel style={{borderTop: `1px solid ${Colors.grey200}`}} icon="face" size={cardSize}>
          {event.promoter}
        </IconLabel>
      )
    }

    let opacity = 1

    let style = {
      opacity: opacity,
      //width: cardWidthRem + 'rem',
      //width: cardWidthPx + 'px',
      width: cardWidth,
      // width: cardWidthPx,
      height: cardHeightRem + 'rem',
      // height: '100%',
      //minHeight: cardHeightRem + 'rem',
      //maxHeight: cardHeightRem * 2 + 'rem',

      paddingTop: paddingTop || verticalPadding,
      paddingBottom: paddingBottom || verticalPadding,
      paddingLeft: horizontalPadding,
      paddingRight: horizontalPadding,
      borderLeft: `${cardWidthRem * 0.04}rem solid ${eventColor}`,
    }

    return (
      <div style={style} className="Event lvl-1" onClick={this.onEventClick}>
        {debugComponent}

        <EventName size={cardSize} height={cardHeightRem} name={name} type={event.type}
          typeColor={eventColor} eventStatus={event.status}/>
        {event.notes && <Icon name="speaker_notes" className="icon" color={eventColor}/>}
        {eventGroupComponent}
        {locationComponent}
        {promoterComp}
      </div>
    )
  }
}

Event.propTypes = {
  //TODO bc: id, name and discipline are covered under "event type"
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  //location: PropTypes.any,
  //width in coluns card is going to take
  width:  PropTypes.oneOf([1, 2, 3, 4]).isRequired,
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
    discipline: PropTypes.oneOf(Object.keys(Disciplines).map(x => Disciplines[x])),
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
