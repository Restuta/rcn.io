import React, { PropTypes } from 'react'
import Component from 'react-pure-render/component'
import './Calendar.scss'
import Day from './Day.jsx'
import Week from './Week.jsx'
import Event from './events/Event.jsx'
import WeekdaysHeader from './WeekdaysHeader.jsx'
import { firstDayOfMonth, lastDayOfMonth } from './utils/date-utils.js'
import moment from  'moment-timezone'
import { createHighlightedStringComponent } from 'client/utils/component.js'
import Badge from 'calendar/badges/Badge.jsx'

const getEventByDate = (eventsMap, date) => {
  const key = date.format('MMDDYYYY')
  return eventsMap.get(key) || []
}

const createEventComponents = (events, draft, daySize, containerWidth) => {
  let eventComponents

  if (events.length > 0) {
    eventComponents = events.map((event, i) =>
      <Event id={event.id} key={event.id}
        widthColumns={daySize}
        containerWidth={containerWidth}
        event={event}
        draft={draft}
        highlightEventTypeInName
      />
    )
  }

  return eventComponents
}

const createDayComponent = (key, currentDate, today, daySize, eventComponents, containerWidth) => {
  const itIsFirstDayOfMonth = firstDayOfMonth(currentDate)
  const currentDayIsToday = (today.isSame(currentDate, 'days'))
  const month = currentDate.month() + 1
  //using to alternate between months so we they become easier to spot in a caledar
  const currentDayBelongsToAlternateMonth = (currentDate.month() % 2 === 0)

  return (
    <Day key={key} year={currentDate.year()} month={month} day={currentDate.date()}
      size={daySize}
      itIsToday={currentDayIsToday}
      itIsFirstDayOfMonth={itIsFirstDayOfMonth}
      itIsLastDayOfMonth={lastDayOfMonth(currentDate)}
      itIsAlternateMonthsDay={currentDayBelongsToAlternateMonth}
      containerWidth={containerWidth}
      dayOfWeek={currentDate.isoWeekday()}
      weekNumber={currentDate.isoWeek()}>
      {eventComponents}
    </Day>
  )
}

class Calendar extends Component {
  // constructor(props) {
  //   super(props)
  //   this.handleScroll = this.handleScroll.bind(this)
  // }

  // handleScroll() {
  //   console.info('scroll')
  // }
  //
  // componentDidMount() {
  //   window.addEventListener('scroll', this.handleScroll)
  // }
  //
  // componentWillUnmount() {
  //   window.removeEventListener('scroll', this.handleScroll)
  // }


  render() {
    console.info('Calendar render is called') //eslint-disable-line
    const {
      name,
      highlight,
      description,
      year,
      containerWidth,
      weekdaysSizes,
      events,
      timeZone,
      showPastEvents,
      draft = false,
      onShowFullHidePastClick
    } = this.props

    let shouldShowHidePastLink = false

    //time-zone specific moment factory
    const momentTZ = function() {
      return moment.tz(...arguments, timeZone)
    }

    const today = momentTZ()

    const firstDayOfTheYear = momentTZ({year: year, month: 0, day: 1})
    let calendarStartDate = momentTZ({year: year, month: 0, day: 1}).startOf('isoWeek')
    let totalWeeksToShow = 53
    //set a date to two weeks back monday, -6 means Monday
    const twoMondaysBackDay = today.clone().isoWeekday(-6)
    const twoWeeksBackIsWithinCurrentYear = (twoMondaysBackDay.year() === today.year())

    // if first day of year is before today only then we want to show "hide/show past" link
    if (firstDayOfTheYear.isBefore(today)
      && twoWeeksBackIsWithinCurrentYear
      && !showPastEvents
      && year === today.year()) {
      calendarStartDate = twoMondaysBackDay
      //if two weeks back it's still current year, then we change total weeks to hide past events
      totalWeeksToShow = totalWeeksToShow - calendarStartDate.get('isoWeek')
    }

    if (year === today.year() && twoWeeksBackIsWithinCurrentYear) {
      shouldShowHidePastLink = true
    }

    let currentDate = calendarStartDate.clone()
    let weeksComponents = []

    for (let i = 1; i <= totalWeeksToShow; i++) {
      let daysComponents = []
      let weekContainsFirstDayOfMonth = false

      for (let k = 1; k <= 7; k++) {
        const daySize = weekdaysSizes[currentDate.isoWeekday() - 1]
        const foundEvents = getEventByDate(events.map, currentDate)

        const eventComponents = createEventComponents(foundEvents, draft, daySize, containerWidth)
        daysComponents.push(createDayComponent(k, currentDate, today, daySize, eventComponents, containerWidth))

        if (firstDayOfMonth(currentDate)) {
          weekContainsFirstDayOfMonth = true
        }

        currentDate.add(1, 'day')
      }

      const currentMonth = currentDate.month() + 1

      weeksComponents.push(
        <Week key={i} month={currentMonth} lastOne={i === totalWeeksToShow}
          containsFirstDayOfMonth={weekContainsFirstDayOfMonth}>
          {daysComponents}
        </Week>
      )
    }

    let subTitleComp
    const eventsTotalFromToday = events.getTotalFrom(today)

    if (showPastEvents || eventsTotalFromToday === 0) {
      subTitleComp = (
        <h3 className="sub-title">
          {events.total} events
          {shouldShowHidePastLink &&
            <a className="show-more-or-less" onClick={onShowFullHidePastClick}>
              hide past events
            </a>
          }
        </h3>
      )
    } else {
      subTitleComp = (
        <h3 className="sub-title">
          {eventsTotalFromToday} upcoming events from <span className="today-date">Today ({today.format('MMMM Do')})</span>
          {shouldShowHidePastLink
            && (<a className="show-more-or-less" onClick={onShowFullHidePastClick}>
              show all {events.total} events
            </a>)
          }
        </h3>
      )
    }

    const nameCompChildren = highlight
      ? createHighlightedStringComponent({text: name, stringToHiglight: highlight.word, higlightColor: highlight.color})
      : name

    const nameComp = (
      <h1 className="title">
        {nameCompChildren}{draft && <Badge square customFontSize heightRem={8} className="margin lft-1">DRAFT</Badge>}
      </h1>
    )

    return (
      <div className="Calendar">
        {/*{eventDetailsModal.isOpen && <EventDetailsModal onClose={this.onEventDetailsModalClose}/>}*/}
        {nameComp}
        {subTitleComp}
        {description && <h4 className="sub-title">{description}</h4>}

        <div className="body">
          <WeekdaysHeader sizes={weekdaysSizes} containerWidth={containerWidth}/>
          <div className="body">
            {weeksComponents}
          </div>
        </div>
      </div>
    )
  }
}

Calendar.propTypes = {
  year: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  highlight: PropTypes.shape({
    word: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  }),
  description: PropTypes.string,
  calendarId: PropTypes.string.isRequired,
  weekdaysSizes: PropTypes.arrayOf(React.PropTypes.number),
  timeZone: PropTypes.string.isRequired, //list of timezones https://github.com/moment/moment-timezone/blob/develop/data/packed/latest.json
  events: PropTypes.shape({
    map: PropTypes.object.isRequired,
    total: PropTypes.number.isRequired,
  }),
  containerWidth: PropTypes.number.isRequired,
  showPastEvents: PropTypes.bool,
  draft: PropTypes.bool,
  onShowFullHidePastClick: PropTypes.func,
}

import { connect } from 'react-redux'
import { toggleShowPastEvents } from 'shared/actions/actions.js'
import { getCalendar, getEventsByDateForCalendar } from 'shared/reducers/reducer.js'


export default connect(
  (state, ownProps) => ({
    ...getCalendar(state, ownProps),
    events: getEventsByDateForCalendar(state, ownProps)
  }),
  (dispatch, ownProps) => ({
    onShowFullHidePastClick: () => dispatch(toggleShowPastEvents(ownProps.calendarId))
  })
)(Calendar)
