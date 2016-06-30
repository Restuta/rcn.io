import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './EventDetails.scss'
import Row from 'atoms/Row.jsx'
import Col from 'atoms/Col.jsx'

export default class EventDetails extends Component {
  render() {
    const {eventId} = this.props.params || 0
    const insideModal = (
      (this.props.location
      && this.props.location.state
      && this.props.location.state.modal)
    )

    const eventDetailsComponent = (
      <div className="EventDetails">
        <div className="content">
          <div style={{
            position: 'absolute',
            top: 0,
            textAlign: 'center',
            right: '16rem',
            color: 'white',
            fontSize: '1.75rem',
            width: '16rem',
            height: '4rem',
            transform: 'skew(-20deg)',
            fontWeight: '900',
            fontStyle: 'italic',
            padding: '1rem',
            backgroundColor: 'blueviolet'
          }}><div style={{transform: 'skew(20deg)'}}>STAGE RACE</div></div>
          <Row>
            <Col xs={14} sm={9}>
              <h4 style={{marginTop: 0, color: 'grey'}} className="header-regular w-500">
                Saturday, May 13th <i>(in 43 days)</i>
              </h4>
              <h3 style={{marginTop: 0}} className="header-regular w-900">Chico Stage Race pb Sierra Nevada Brewing
                Co — Stage 4: Steve Harrison Memorial Criterium
              </h3>
            </Col>
            <Col xs={14} sm={5}>Criterium #{eventId}</Col>
          </Row>
          <Row>
            <Col xs={14} sm={9}>
              <div style={{minHeight: '50rem'}}>map</div>
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
