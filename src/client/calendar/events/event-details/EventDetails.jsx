import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './EventDetails.scss'
import Row from 'atoms/Row.jsx'
import Col from 'atoms/Col.jsx'
import Colors from 'styles/colors'
import RaceTypeBadge from './RaceTypeBadge.jsx'
import Flyer from './Flyer.jsx'
import momentTZ from  'moment-timezone'
import GoogleStaticMap from './GoogleStaticMap.jsx'
import AddressLink from './AddressLink.jsx'
import Icon from 'atoms/Icon.jsx'
import { getEventColor } from 'client/calendar/utils/event-colors.js'
import { locationToAddressStr } from 'client/calendar/utils/location.js'
import { Statuses, EventTypes } from 'client/calendar/events/types.js'
import classnames from 'classnames'
import UsacPermit from './UsacPermit.jsx'
import PresentedBy from './PresentedBy.jsx'
import EventWebsite from './EventWebsite.jsx'
import { RegButton, ResultsButton } from './Buttons.jsx'
import Alert from 'atoms/Alert.jsx'
import { Link } from 'react-router'

const getUsacFlyerUrl = permit => (`https://www.usacycling.org/events/getflyer.php?permit=${permit.trim()}`)

const crteateLetUsKnowLink = ({subject, body = ''}) => (
  'mailto:a@rcn.io?cc=webmaster@ncnca.org'
  + `&subject=${encodeURIComponent(subject)}`
  + `&body=${encodeURIComponent(body)}`
)

const getAbsoluteEventUrl = id => (`https://rcn.io/events/${id}`)

const formatDate = (date, today) => {
  if (!date) return ''

  const currentYearFormat = 'dddd, MMMM Do'
  const otherYearFormat = 'dddd, MMMM Do, YYYY'

  let formattedDate

  if (date.year() === today.year()) {
    formattedDate = date.format(currentYearFormat)
  } else {
    formattedDate = date.format(otherYearFormat)
  }

  return formattedDate
}

const dateIsInFuture = (date, today) => date > today

const getUsacResultsUrl  = permitNo => `https://www.usacycling.org/results/?permit=${permitNo}`

const renderedInsideModal = props => (
  !!(props.location
  && props.location.state
  && props.location.state.modalProps
  && props.location.state.modalProps.isOpen)
)

class EventDetails extends Component {
  // check if component is rendered inside modal

  onResultsBtnClick = () => {
    // console.info(...arguments)
    window.location.href = this.resultsUrl
  }

  onRegisterBtnClick = () =>  {
    window.location.href = this.props.event.registrationUrl
    // window.drift.api.sidebar.open()
    // window.open(this.props.event.registrationUrl, '_blank')
  }

  onMovedToLinkClick = (e) => {
    e.preventDefault()
    this.props.replaceRoutedModal(`/events/${this.props.movedToEvent.id}`)
  }

  render() {
    const insideModal = renderedInsideModal(this.props)
    //TODO: hardcoding timezone for now, it should come from calendar later
    const moment = () => momentTZ.tz(...arguments, 'America/Los_Angeles')
    const today = moment()

    const {
      id,
      name = '——',
      date = today,
      location = {},
      discipline,
      type,
      isDraft: eventIsDraft,
      draftNotes,
      status,
      cancelationReason,
      promoters,
      websiteUrl,
      usacPermit,
      registrationUrl,
      resultsUrl: originalResultsUrl,
      group,
      promoterInfo,
    } = this.props.event

    // TODO: migrate old events to have flyer section and not just "flyerUrl" property
    const { movedToEvent } = this.props

    let movedToEventDate
    let formattedMovedToDate
    let relativeMovedToDate

    if (status === Statuses.moved && movedToEvent) {
      movedToEventDate = movedToEvent.date
      formattedMovedToDate = formatDate(movedToEventDate, today)
      relativeMovedToDate = dateIsInFuture(movedToEventDate, today)
        ? `(${movedToEventDate.fromNow()})`
        : ''
    }

    const flyerUrl = this.props.event.usacPermit
      ? getUsacFlyerUrl(this.props.event.usacPermit)
      : (this.props.event.flyer && this.props.event.flyer.url) || this.props.event.flyerUrl

    const promoterContactName = (promoters && promoters.length > 0)
      ? promoters.map(x => x.contactName)[0]
      : ''

    const presentedBy = (promoters && promoters.length > 0)
      ? promoters.map(x => x.name).join(' / ')
      : '——'

    const series = (this.props.event.series && this.props.event.series.length > 0)
      ? this.props.event.series
      : [{ name: '——' }]

    let resultsUrl = originalResultsUrl || (usacPermit ? (getUsacResultsUrl(usacPermit)) : '')
    this.resultsUrl = resultsUrl

    const classNames = classnames('EventDetails', {
      'canceled': status === Statuses.canceled,
      'moved': status === Statuses.moved
    })

    const formattedDate = formatDate(date, today)
    const relativeDate = date.fromNow()

    const startAddress = locationToAddressStr(location)
    const from = encodeURIComponent('Current Location') //users current location
    const to = encodeURIComponent(startAddress)
    const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/${from}/${to}`

    const itIsPastEvent = date.isBefore(today)
    let raceTypeBadgesComp = []

    if (itIsPastEvent) {
      raceTypeBadgesComp.push(<RaceTypeBadge key={10} inverted name="PAST" color={Colors.event.status.past}/>)
    }

    if (eventIsDraft && group) {
      raceTypeBadgesComp.push(<RaceTypeBadge key={80} inverted name={'GROUP ' + group} color={Colors.grey800} />)
    }

    const eventColor = getEventColor(discipline, type, status)
    const eventType = (type || discipline || '').toUpperCase()
    const showInvertedBadge = (type === EventTypes.other.meeting || type === EventTypes.nonCompetitive.default)

    raceTypeBadgesComp.push(<RaceTypeBadge key={30} inverted={showInvertedBadge} name={eventType} color={eventColor} />)

    const notesComp = ((draftNotes && eventIsDraft) && (
      <Row>
        <Col xs={14} sm={9}>
          <h4 className="w-700 header-regular">
            <Icon className="margin rgt-05" name="speaker_notes" size={2.5} top={-1} color={Colors.grey600}/>
            <span style={{color: Colors.grey500}}>Notes by </span>
            {promoterContactName}:
          </h4>
          <p className="text-sm-14">{draftNotes || '--'}</p>
        </Col>
      </Row>
    ))

    const eventDetailsComponent = (
      <div className={classNames}>
        <div className="content">
          <div className="badges">
            {raceTypeBadgesComp}
          </div>
          {status === Statuses.canceled && (
            <Row className="margin top-3">
              <Col xs={14}>
                <Alert type="danger" flat showIcon={true}>Event has been <b>canceled.</b>
                  <br />
                  <span>reason: {cancelationReason || '<not specified>'}</span>
                </Alert>
              </Col>
            </Row>
          )}
          {status === Statuses.moved && (
            <Row className="margin top-3">
              <Col xs={14}>
                <Alert type="warning" flat showIcon={true}>This event has been <b>moved</b>
                  <span> to a new date&nbsp;
                    {formattedMovedToDate
                      ? (
                      <span>
                        {insideModal
                          ? (
                          <Link onClick={this.onMovedToLinkClick}>
                            {formattedMovedToDate}&nbsp;{relativeMovedToDate}</Link>
                          )
                          : (
                          <Link to={`/events/${this.props.movedToEvent.id}`}>
                            {formattedMovedToDate}&nbsp;{relativeMovedToDate}</Link>
                          )
                        }
                      </span>
                      )
                      : (
                      <span>which is not yet known.<br />
                        <small><i>
                          (know new date? help community, &nbsp;
                          <a href={crteateLetUsKnowLink({
                            subject: `I know new date for event "${name}"`,
                            body: ` ...is the new date. \n\n event url: ${getAbsoluteEventUrl(id)}`,
                          })} onClick={this.onLetUsKnowClick}>let us know!</a>)
                        </i></small>
                      </span>)
                    }
                  </span>
                </Alert>
              </Col>
            </Row>
          )}
          <Row>
            <Col xs={14} sm={9}>
              <h4 className="header-regular w-500 date">
                {formattedDate} <span className="relative">({relativeDate})</span>
              </h4>
              <h1 className="header-regular w-900 name">{name}</h1>
            </Col>
            <Col xs={14} sm={5} />
          </Row>
          <Row className="promoted-by-section">
            <Col xs={14} className="promoted-by-section-container">
              <PresentedBy by={presentedBy}/>
              <UsacPermit number={usacPermit || '——'}/>
            </Col>
          </Row>
          <hr className="spacer" />
          <Row>
            <Col xs={14}>
              <AddressLink url={googleMapsDirectionsUrl} className="address-link"
              location={location}/>
            </Col>
          </Row>
          <Row>
            <Col xs={14} sm={9}>
              <div style={{
                marginBottom: '3rem',
              }}>
                <GoogleStaticMap width={416} height={352}
                  startAddressMarkerColor={eventColor}
                  startAddress={startAddress}
                  homeAddress='San Jose, CA' />
              </div>
            </Col>
            <Col xs={14} sm={5} className="register-section-container">
              <div className="reg-results-button-container">
                {itIsPastEvent
                  ? <ResultsButton resultsUrl={resultsUrl} onClick={this.onResultsBtnClick}/>
                  : <RegButton regUrl={registrationUrl} onClick={this.onRegisterBtnClick}/>
                }
              </div>
              <EventWebsite url={websiteUrl} />
              <hr className="spacer no-margin-top margin bot-1" />
              <p className="text-2 notes-from-promoter">{promoterInfo}</p>
            </Col>
          </Row>
          <hr className="spacer no-margin-top" />
          {/* <Row>
            <Col xs={14} sm={9}>
            </Col>
          </Row> */}
          <Row>
            <Col xs={14} sm={9}>
              <h4 className="header-regular header-4">PART OF</h4>
              {series.map((x, i) => <div key={i} className="text-2">{x.name}</div>)}
            </Col>
          </Row>
          {notesComp}
          <Row className="flyer-section">
            <Col xs={14}>
              <Flyer url={flyerUrl} />
            </Col>
          </Row>

        </div>
      </div>
    )

    return (
      insideModal
        ? eventDetailsComponent
        : (
          // eslint-disable-next-line
          <div className='EventDetails-container'>
            {eventDetailsComponent}
          </div>
        )
    )
  }
}

EventDetails.propTypes = {
  event: PropTypes.object.isRequired,
  // if event status is "Moved" this would contain event it's moved to
  movedToEvent: PropTypes.object,
}

import { connect } from 'react-redux'
import { getEvent } from 'shared/reducers/reducer.js'
import { replaceRoutedModal } from 'shared/actions/actions.js'

export default connect(
  (state, ownProps) => {
    // to have "back to calendar" button
    // calendar: getCalendar()

    const event = getEvent(state, ownProps.params.eventId)
    let movedToEvent

    if (event.status === Statuses.moved && event.movedToEventId) {
      movedToEvent = getEvent(state, event.movedToEventId)
    }

    return { event, movedToEvent }
  },
  (dispatch, ownProps) => ({
    replaceRoutedModal: (path) => dispatch(replaceRoutedModal({path, hasPadding: false}))
  }),
)(EventDetails)
