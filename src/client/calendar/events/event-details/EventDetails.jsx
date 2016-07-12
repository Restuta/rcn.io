import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './EventDetails.scss'
import Row from 'atoms/Row.jsx'
import Col from 'atoms/Col.jsx'
import classnames from 'classnames'
import Typography from 'styles/typography'
import Colors from 'styles/colors'
import { addUrlParams } from 'utils/url-utils'


const RaceTypeBadge = ({name, color, className}) => (
  <span style={{
    textAlign: 'center',
    color: 'white',
    fontSize: Typography.scaleUp(2) + 'rem',
    width: 'auto',
    minWidth: '16rem',
    height: '3rem',
    transform: 'skew(-20deg)',
    fontWeight: '900',
    fontStyle: 'italic',
    paddingLeft: '2rem',
    paddingRight: '2rem',
    backgroundColor: color,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }} className={classnames('RaceTypeBadge', className)}>
    <span style={{transform: 'skew(20deg)'}}>{name}</span>
  </span>
)

const PresentedBy = ({by}) => (
  <div style={{
    fontStyle: 'italic',
    position: 'relative',
    top: Typography.pxToRem(4) + 'rem'
  }}>
    <span style={{color: Colors.grey500}}>by</span> <a href="#">{by}</a>
  </div>
)

const Map = ({width, height, homeAddress, startAddress}) => {
  const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap'
  // const homeMarkerColor = '0x4caf50'
  const homeMarkerColor = `0x${Colors.primary.slice(1)}`
  const eventMarkerColor = '0xF44336'

  const params = {
    size: `${width}x${height}`,
    scale: 2,
    format: 'png8',
    maptype: 'roadmap',
    markers: [
      `size:normal|color:${eventMarkerColor}|label:S|${startAddress}`,
      `size:small|color:${homeMarkerColor}|label:H|${homeAddress}`,
    ],
    style: 'saturation:-50|lightness:0|gamma:1.5',
    visibility: 'simplified',
    key: 'AIzaSyAzpETb1x1vce3mw_n2jnDBDlKDjZ4iH2c',
  }

  const googleApiUrl = addUrlParams(baseUrl, params)

  return (<img style={{width: `${width}px`, height: `${height}px`}} src={googleApiUrl}/>)
}

const MapWithAddress = props => {
  const { startAddress } = props
  const style = {
    marginBottom: '1rem',
    display: 'inline-block',
    position: 'relative',
    top: Typography.pxToRem(3) + 'rem',
    fontSize: Typography.scaleUp(2.5) + 'rem',
  }

  const from = encodeURIComponent('Current Location') //users current location
  const to = encodeURIComponent(startAddress)
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/${from}/${to}`

  return (
    <div>
      <a href={googleMapsDirectionsUrl} target="_blank" style={style}>{startAddress}</a>
      <Map {...props}/>
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
            <RaceTypeBadge name="PAST" color={Colors.grey500} className="type-badge" />
            <RaceTypeBadge name="STAGE RACE" color={Colors.deepPurple700} className="type-badge" />
            <RaceTypeBadge name="CRITERIUM" color="#4CAF50" className="type-badge" />
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
                // background: 'rgba(165, 214, 167, 0.1)',
                marginBottom: '6rem',
              }}>
                <MapWithAddress width={400} height={352}
                  startAddress='5250 Hwy 162, Willows, CA'
                  homeAddress='San Jose, CA' />
              </div>
            </Col>
            <Col xs={14} sm={5}><button className="btn btn-secondary">Register</button></Col>
          </Row>
          <Row>
            <Col xs={14} sm={9}>
            Part of:
            </Col>
            <Col xs={14} sm={5}>Links</Col>
          </Row>
          <Row>
            <Col xs={14}>
              <div className="flyer">Flyer</div>
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
