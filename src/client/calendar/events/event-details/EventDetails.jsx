import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './EventDetails.scss'
import Row from 'atoms/Row.jsx'
import Col from 'atoms/Col.jsx'
import classnames from 'classnames'
import Typography from 'styles/typography'
import Colors from 'styles/colors'


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
          <div className="badges">
            <RaceTypeBadge name="PAST" color={Colors.grey500} className="type-badge" />
            <RaceTypeBadge name="STAGE RACE" color={Colors.deepPurple700} className="type-badge" />
            <RaceTypeBadge name="CRITERIUM" color="#4CAF50" className="type-badge" />
          </div>

          <Row>
            <Col xs={14} sm={9}>
              <h4 className="header-regular w-500 date">
                Saturday, May 13th <i className="relative">(in 43 days)</i>
              </h4>
              <h3 className="header-regular w-900 name">Chico Stage Race pb Sierra Nevada Brewing
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
