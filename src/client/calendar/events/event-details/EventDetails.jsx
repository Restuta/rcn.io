import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './EventDetails.scss'
import Row from 'atoms/Row.jsx'
import Col from 'atoms/Col.jsx'
import Button from 'atoms/Button.jsx'
import { pxToRem } from 'styles/typography'
import Colors from 'styles/colors'
import RaceTypeBadge from './RaceTypeBadge.jsx'
import Flyer from './Flyer.jsx'
import momentTZ from  'moment-timezone'
import GoogleStaticMap from './GoogleStaticMap.jsx'
import AddressLink from './AddressLink.jsx'
import Icon from 'atoms/Icon.jsx'

import { getEventColor } from 'client/calendar/utils/event-colors.js'
import { locationToAddressStr } from 'client/calendar/utils/location.js'

const PresentedBy = ({by}) => {
  return (
    <div style={{
      fontStyle: 'italic',
      position: 'relative',
      top: pxToRem(4) + 'rem'
    }}>
      <span className="secondary">by {(by || '--')}</span>
    </div>
  )
}

export default class EventDetails extends Component {
  constructor(props) {
    super(props);
    this.onRegisterBtnClick = this.onRegisterBtnClick.bind(this)
  }

  onRegisterBtnClick() {
    window.location.href = this.props.event.registrationUrl
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
      notes,
      promoterName,
      promoter,
      promoterUrl,
      registrationUrl,
      group
    } = this.props.event


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

    if (group) {
      raceTypeBadgesComp.push(<RaceTypeBadge key={80} inverted name={'GROUP ' + group} color={Colors.grey800} />)
    }

    const eventColor = getEventColor(discipline, type, status)
    console.info(eventColor)
    const eventType = (type || discipline || '').toUpperCase()

    raceTypeBadgesComp.push(<RaceTypeBadge key={30} name={eventType} color={eventColor} />)

    const notesComp = (notes && (
      <Row>
        <Col xs={14} sm={9}>
          <h4 className="w-700 header-regular">
            <Icon name="speaker_notes" size={2.5} top={-4} color={Colors.grey600}/>
            <span style={{color: Colors.grey500}}>Notes by </span>
            {promoterName}:
          </h4>
          <p className="text-sm-14">{notes || '--'}</p>
        </Col>
      </Row>
    ))

    const eventDetailsComponent = (
      <div className="EventDetails">
        <div className="content">
          <div className="badges">
            {raceTypeBadgesComp}
          </div>
          <Row>
            <Col xs={14} sm={9}>
              <h4 className="header-regular w-500 date">
                {formattedDate} <span className="relative">({relativeDate})</span>
              </h4>
              <h3 className="header-regular w-900 name">{name}</h3>
            </Col>
            <Col xs={14} sm={5} />
          </Row>
          <Row>
            <Col xs={14}>
              <PresentedBy by={promoter}/>
              <hr className="spacer" />
            </Col>
          </Row>
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
            <Col xs={14} sm={5}>
              {(!itIsPastEvent && registrationUrl)
                && <Button size="sm" primaryHover className="btn-register" onClick={this.onRegisterBtnClick}>REGISTER</Button>}
              <div className="events-website-link text-3">
                <a href={promoterUrl} target="_blank">
                  <Icon name="public" size={2.5} top={-5} color={Colors.primary}/>
                  Event's Website
                </a>
              </div>
            </Col>
            {/* <Col xs={14} sm={5}>

            </Col> */}
          </Row>
          <hr className="spacer no-margin-top" />
          {/*<Row>
            <Col xs={14} sm={9}>
            Part of:
            </Col>
            <Col xs={14} sm={5}>Links</Col>
          </Row>*/}
          {/* <Row>
            <Col smOffset={9} xs={5}>
              <a href={promoterUrl} target="_blank">
                {promoterUrl}
              </a>
            </Col>
          </Row> */}
          {notesComp}
          <Row className="margin top-4">
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
