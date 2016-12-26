import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './EventDetails.scss'
import Row from 'atoms/Row.jsx'
import Col from 'atoms/Col.jsx'
import Button from 'atoms/Button.jsx'
// import { pxToRem } from 'styles/typography'
import Colors from 'styles/colors'
import RaceTypeBadge from './RaceTypeBadge.jsx'
import Flyer from './Flyer.jsx'
import momentTZ from  'moment-timezone'
import GoogleStaticMap from './GoogleStaticMap.jsx'
import AddressLink from './AddressLink.jsx'
import Icon from 'atoms/Icon.jsx'
import { getShorterUrl } from 'utils/url-utils'
import { getEventColor } from 'client/calendar/utils/event-colors.js'
import { locationToAddressStr } from 'client/calendar/utils/location.js'
import { Statuses, EventTypes } from 'client/calendar/events/types.js'
import classnames from 'classnames'
import Badge from 'calendar/badges/Badge.jsx'
import UsacLogo from 'atoms/UsacLogo.jsx'

const PresentedBy = ({by}) => (
  <span className="text-2" style={{
    fontStyle: 'italic',
    position: 'relative',
    marginRight: '2rem',
    marginBottom: '2rem',
  }}>
    <span className="secondary">by {(by || '--')}</span>
  </span>
)

const UsacPermit = ({number}) => (
  <span className="nowrap secondary">
    <UsacLogo size={1} style={{marginRight: '1rem'}}/>
    <span className="text-sm-11 top-0">PERMIT {number}</span>
  </span>
)

const EventWebsite = ({url}) => {
  let eventComp

  if (url) {
    eventComp = (
      <a href={url} target="_blank">
        <Icon name="public" className="margin rgt-05" size={2} top={-1} color={Colors.primary}/>
        {getShorterUrl(url)}
      </a>
    )
  } else {
    eventComp = (<div>
      <Icon name="public" className="margin rgt-05" size={2} top={-1} color={Colors.grey500}/>
      {'--'}
    </div>
    )
  }

  return (
    <div>
      <h4 className="header-regular header-4">Event Website</h4>
      <div className="events-website-link text-3">
        {eventComp}
      </div>
    </div>
  )
}

const PrimaryButton = ({text, icon, disabled, onClick}) => (
  <Button size="sm" icon={icon} disabled={disabled} primaryHover className="primary-button" onClick={onClick}>
    {text}
  </Button>
)

const RegButton = ({regUrl, onClick}) => (
  regUrl
    ? <PrimaryButton text="REGISTER" onClick={onClick}/>
    : <PrimaryButton text="NO REG LINK" icon="sentiment_dissatisfied" disabled Click={onClick}/>
)

const ResultsButton = ({resultsUrl, onClick}) => (
  resultsUrl
    ? <PrimaryButton text="RESULTS" onClick={onClick}/>
    : <PrimaryButton text="NO RESULTS LINK" icon="sentiment_dissatisfied" disabled Click={onClick}/>
)

const getUsacResultsUrl  = permitNo => `https://www.usacycling.org/results/?permit=${permitNo}`

class EventDetails extends Component {
  constructor(props) {
    super(props)
    this.onRegisterBtnClick = this.onRegisterBtnClick.bind(this)
    this.onResultsBtnClick = this.onResultsBtnClick.bind(this)
  }


  onResultsBtnClick() {
    // console.info(...arguments)
    window.location.href = this.resultsUrl
  }

  onRegisterBtnClick() {
    window.location.href = this.props.event.registrationUrl
    // window.drift.api.sidebar.open()
    // window.open(this.props.event.registrationUrl, '_blank')
  }

  render() {
    const insideModal = (
      (this.props.location
      && this.props.location.state
      && this.props.location.state.modal)
    )
    //TODO: hardcoding timezone for now, it should come from calendar later
    const moment = () => momentTZ.tz(...arguments, 'America/Los_Angeles')
    const today = moment()

    const {
      name = '——',
      date = today,
      flyerUrl,
      location = {},
      discipline,
      type,
      isDraft: eventIsDraft,
      draftNotes,
      status,
      promoters,
      websiteUrl,
      usacPermit,
      registrationUrl,
      resultsUrl: originalResultsUrl,
      group,
      promoterInfo
    } = this.props.event

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
    const currentYearFormat = 'dddd, MMMM Do'
    const otherYearFormat = 'dddd, MMMM Do, YYYY'

    let formattedDate

    if (date.year() === today.year()) {
      formattedDate = date.format(currentYearFormat)
    } else {
      formattedDate = date.format(otherYearFormat)
    }

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
          <Row>
            <Col xs={14} sm={9}>
              {status && (
                <Badge inverted className="status-badge" borderColor={Colors.red500}
                  bgColor={Colors.bodyBg} color={Colors.red500} heightRem={4} square>
                  {status.toUpperCase()}
                </Badge>)
              }
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
        <div className='EventDetails-container'>
          {eventDetailsComponent}
        </div>
        )
    )
  }
}

EventDetails.propTypes = {
  event: PropTypes.object.isRequired
}

import { connect } from 'react-redux'
import { getEvent } from 'shared/reducers/reducer.js'

export default connect(
  (state, ownProps) => {
    //to have "back to calendar" button
    // calendar: getCalendar()
    return { event: getEvent(state, ownProps.params.eventId) || {} }
  }
)(EventDetails)
