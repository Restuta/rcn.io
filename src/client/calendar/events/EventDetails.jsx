import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'

export default class EventDetails extends Component {
  render() {
    const {eventId} = this.props.params
    return (
      <div className="EventDetails">Event Details of: {eventId}</div>
    )
  }
}

EventDetails.propTypes = {
  details: PropTypes.string
}
