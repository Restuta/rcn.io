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
import { Disciplines } from 'client/temp/events.js'

const PresentedBy = ({by}) => (
  <div style={{
    fontStyle: 'italic',
    position: 'relative',
    top: pxToRem(4) + 'rem'
  }}>
    <span style={{color: Colors.grey500}}>by</span> <a href="#">{by}</a>
  </div>
)

const locationToAddressStr = ({streetAddress = '', city = '', state = '', zip = ''}) => {
  let addressArr = []
  const pushIfNotEmpty = prop => (prop && addressArr.push(prop))

  pushIfNotEmpty(streetAddress)
  pushIfNotEmpty(city)
  pushIfNotEmpty(state)

  return (addressArr.join(', ') + ' ' + zip).trim()
}

export default class EventDetails extends Component {
  render() {
    const insideModal = (
      (this.props.location
      && this.props.location.state
      && this.props.location.state.modal)
    )
    //TODO: hardcoding timezone for now
    const moment = () => momentTZ.tz(...arguments, 'America/Los_Angeles')

    const {
      name = '——',
      date = moment(),
      flyerUrl,
      location = {},
      discipline,
      type,
    } = this.props.event

    console.info(location)


    const today = moment()
    const currentYearFormat = 'dddd, MMMM Do'
    const otherYearFormat = 'dddd, MMMM Do, YYYY'

    let formattedDate

    if (date.year() === today.year()) {
      formattedDate = date.format(currentYearFormat)
    } else {
      formattedDate = date.format(otherYearFormat)
    }

    const relativeDate = date.fromNow()

    const flyerComp = (flyerUrl
      ? <Flyer url={flyerUrl} />
      : <div>No flyer (yet?)</div>
    )

    const from = encodeURIComponent('Current Location') //users current location
    const to = encodeURIComponent(locationToAddressStr(location))
    const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/${from}/${to}`
    const startAddress = locationToAddressStr(location)

    let raceTypeBadgesComp = []

    if (date.isBefore(today)) {
      raceTypeBadgesComp.push(<RaceTypeBadge key={10} name="PAST" color={Colors.grey500}/>)
    }

    console.info(discipline)
    console.info(type)

    if (discipline === Disciplines.MTB) {
      raceTypeBadgesComp.push(<RaceTypeBadge key={20} name="MTB" color={Colors.brownMud} />)
    }

    if (discipline === Disciplines.Road) {
      switch (type) {
        case 'Road Race':
          raceTypeBadgesComp.push(<RaceTypeBadge key={30} name="ROAD RACE" color='#2196F3' />)
          break
        case 'Criterium':
          raceTypeBadgesComp.push(<RaceTypeBadge key={40} name="CRITERIUM" color='#00BF10' />)
          break
        case 'Hill Climb':
          raceTypeBadgesComp.push(<RaceTypeBadge key={50} name="HILL CLIMB" color={Colors.red700} />)
          break
        case 'Circuit Race':
          raceTypeBadgesComp.push(<RaceTypeBadge key={60} name="CIRCUIT RACE" color='#F57C00' />)
          break
        case 'Time Trial':
          raceTypeBadgesComp.push(<RaceTypeBadge key={70} name="TIME TRIAL" color={Colors.red500} />)
          break
        default:
          break
      }
    }

    const eventDetailsComponent = (
      <div className="EventDetails">
        <div className="content">
          <div className="badges">
            {/*<RaceTypeBadge name="PAST" color={Colors.grey500}/>
            <RaceTypeBadge name="STAGE RACE" color={Colors.deepPurple700}/>
            <RaceTypeBadge name="CRITERIUM" color="#4CAF50" />*/}
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
              <PresentedBy by="——"/>
              <hr className="spacer" />
            </Col>
          </Row>
          <Row>
            <Col xs={14}>
              <AddressLink url={googleMapsDirectionsUrl} className="address-link" location={location}/>
            </Col>
          </Row>
          <Row>
            <Col xs={14} sm={9}>
              <div style={{
                marginBottom: '3rem',
              }}>
                <GoogleStaticMap width={416} height={352}
                  startAddress={startAddress}
                  homeAddress='San Jose, CA' />
              </div>
            </Col>
            <Col xs={14} sm={5}>
              <Button size="sm">REGISTER</Button>
            </Col>
          </Row>
          <hr className="spacer no-margin-top" />
          {/*<Row>
            <Col xs={14} sm={9}>
            Part of:
            </Col>
            <Col xs={14} sm={5}>Links</Col>
          </Row>*/}
          <Row>
            <Col xs={14}>
              {flyerComp}
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
  details: PropTypes.string
}

import { connect } from 'react-redux'
import { getEvent } from 'shared/reducers/reducer.js'

export default connect(
  (state, ownProps) => {
    // calendar: getCalendar()
    console.info(ownProps)
    return { event: getEvent(state, ownProps.params.eventId) || {} }
  }
)(EventDetails)
