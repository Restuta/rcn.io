import React from 'react'
import PropTypes from 'prop-types'
import Component from 'react-pure-render/component'
import Grid from 'styles/grid'
import Event from 'calendar/events/Event.jsx'
import { EventDetails } from 'calendar/events/event-details/EventDetails.jsx'

export default class EventPreview extends Component {
  render() {
    const { event } = this.props

    return (
      <div className="EventPreview">
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <div className="margin rgt-4">
            <h3 className="margin bot-1">DESKTOP VIEW</h3>
            <Event event={event} fixedWidth widthColumns={2} baseHeight={6}
              containerWidth={Grid.ContainerWidth.XXL}/>
          </div>
          <div className="margin rgt-4">
            <h3 className="margin bot-1">NCNCA HOMEPAGE VIEW</h3>
            <Event event={event} fixedWidth widthColumns={2} baseHeight={6}
              showEventTypeBadge containerWidth={Grid.ContainerWidth.XXL}/>
          </div>
          <div>
            <h3 className="margin bot-1">IPHONE VIEW</h3>
            <Event event={event} fixedWidth width={'91px'} widthColumns={4} autoHeight={false}
              baseHeight={2} containerWidth={Grid.ContainerWidth.XS}/>
          </div>
        </div>
        <h3 style={{marginBottom: '-3rem'}}>FULL VIEW</h3>
        <div style={{width: '90rem'}}>
          <EventDetails event={event} eventId={event.id}/>
        </div>
      </div>
    )
  }
}

EventPreview.propTypes = {
  event: PropTypes.object.isRequired
}
