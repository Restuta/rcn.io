import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './EventDetails.scss'
import Row from 'atoms/Row.jsx'
import Col from 'atoms/Col.jsx'
import Button from 'atoms/Button.jsx'
import { pxToRem, scaleUp } from 'styles/typography'
import Colors from 'styles/colors'
import { addUrlParams } from 'utils/url-utils'
import RaceTypeBadge from './RaceTypeBadge.jsx'
import Flyer from './Flyer.jsx'

import { rnd } from 'utils/math.js'

const PresentedBy = ({by}) => (
  <div style={{
    fontStyle: 'italic',
    position: 'relative',
    top: pxToRem(4) + 'rem'
  }}>
    <span style={{color: Colors.grey500}}>by</span> <a href="#">{by}</a>
  </div>
)

const GoogleStaticMap = ({width, height, homeAddress, startAddress, zoom}) => {
  const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap'
  // const homeMarkerColor = '0x4caf50'
  const homeMarkerColor = `0x${Colors.primary.slice(1)}`
  const eventMarkerColor = '0xF44336'

  const genericParams = {
    format: 'png8',
    maptype: 'roadmap',
    zoom: zoom,
    markers: [
      `size:normal|color:${eventMarkerColor}|label:S|${startAddress}`
    ],
    // style: [
    //   'saturation:-50|lightness:0|gamma:1.5',
    //   'feature:road.highway|element:all|visibility:simplified',
    //   'feature:water|element:all|color:0x90CAF9|visibility:on',
    //   // 'feature:water|element:all|color:0xb6dbfa|visibility:on',
    // ],
    style: [
      'feature:administrative|element:labels.text.fill|color:0x444444',
      'feature:poi|element:all|visibility:on|saturation:-100',
      'feature:road|element:all|saturation:-100|lightness:45',
      'feature:road.highway|element:all|visibility:simplified',
      'feature:road.arterial|element:labels.icon|visibility:off',
      'feature:transit|element:all|visibility:off',
      'feature:water|element:all|color:0x90CAF9|visibility:on',
      'feature:water|element:all|color:0xb6dbfa|visibility:on',
      // 'feature:water|element:all|color:0xBBDEFB|visibility:on',

    ],
    visibility: 'simplified',
    key: 'AIzaSyAzpETb1x1vce3mw_n2jnDBDlKDjZ4iH2c',
  }

  if (homeAddress) {
    genericParams.markers.push(`size:small|color:${homeMarkerColor}|label:H|${homeAddress}`)
  }

  const bigImageParams = {
    ...genericParams,
    size: `${width}x${height}`,
    scale: 2,
  }

  const midImageParams = {
    ...genericParams,
    size: `${width}x${height}`,
    scale: 1,
  }

  const style = {
    borderRadius: pxToRem(3) + 'rem'
  }

  const googleMapBigImgUrl = addUrlParams(baseUrl, bigImageParams)
  const googleMapMidImgUrl = addUrlParams(baseUrl, midImageParams)

  return (
    <div className="GoogleStaticMap intrinsic intrinsic--13x11">
      <img style={style} className="img-fluid intrinsic-item" alt="Google Map"
        src={googleMapBigImgUrl}
        srcSet={`
          ${googleMapBigImgUrl} 2x,
          ${googleMapMidImgUrl} 1x`}
        />
    </div>
  )
}

const Map = props => {
  const { startAddress, width } = props
  const mapWithAddressStyle = {
    maxWidth: width
  }
  const style = {
    marginBottom: '1rem',
    display: 'inline-block',
    position: 'relative',
    top: pxToRem(3) + 'rem',
    fontSize: scaleUp(2.5) + 'rem',
  }

  const from = encodeURIComponent('Current Location') //users current location
  const to = encodeURIComponent(startAddress)
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/${from}/${to}`

  return (
    <div className='Map' style={mapWithAddressStyle}>
      <a href={googleMapsDirectionsUrl} target="_blank" style={style}>{startAddress}</a>
      <GoogleStaticMap {...props}/>
    </div>
  )
}

export default class EventDetails extends Component {
  render() {
    // const { eventId } = this.props.params || 0
    const insideModal = (
      (this.props.location
      && this.props.location.state
      && this.props.location.state.modal)
    )

    const eventDetailsComponent = (
      <div className="EventDetails">
        <div className="content">
          <div className="badges">
            <RaceTypeBadge name="PAST" color={Colors.grey500}/>
            <RaceTypeBadge name="STAGE RACE" color={Colors.deepPurple700}/>
            <RaceTypeBadge name="CRITERIUM" color="#4CAF50" />
          </div>

          <Row>
            <Col xs={14} sm={9}>
              <h4 className="header-regular w-500 date">
                Saturday, May 13th <span className="relative">(in 43 days)</span>
              </h4>
              <h3 className="header-regular w-900 name">Chico Stage Race pb Sierra Nevada Brewing
                Co — Stage 4: Steve Harrison Memorial Criterium
              </h3>
            </Col>
            <Col xs={14} sm={5} />
          </Row>
          <Row>
            <Col xs={14}>
              <PresentedBy by="Chica Corsa Cycling Club"/>
              <hr className="spacer" />
            </Col>
          </Row>
          <Row>
            <Col xs={14} sm={9}>
              <div style={{
                marginBottom: '6rem',
              }}>
                <Map width={416} height={352}
                  startAddress={`${rnd(1000, 9000)} Hwy 162, Willows, CA`}
                  homeAddress='San Jose, CA' />
              </div>
            </Col>
            <Col xs={14} sm={5} className="section-register">
              <Button size="sm">REGISTER</Button>
            </Col>
          </Row>
          <Row>
            <Col xs={14} sm={9}>
            Part of:
            </Col>
            <Col xs={14} sm={5}>Links</Col>
          </Row>
          <Row>
            <Col xs={14}>
              {/*<div className="flyer">Flyer</div>*/}
              <Flyer url='www.usacycling.org/events/getflyer.php?permit=2016-1578' />
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
