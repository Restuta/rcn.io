import React, {PropTypes} from 'react'
import Sizes from './card-sizes'
import classnames from 'classnames'
import './EventName.scss'
import { Statuses, EventTypes } from 'calendar/events/types'
import { createHighlightedStringComponent } from 'client/utils/component.js'

const EventName = (props) => {
  const {
    name,
    size,
    height,
    eventStatus,
    classNames,
    typeColor,
    type,
    highlightEventType = false,
  } = props
  const className = classnames(`EventName size-${size} size-${size}-${height} fix-fout`,
    classNames)

  //TODO bc: make this production ready, e.g. avoid iteration if one of the names is highlighted
  let wrappedNameComp = name

  if (highlightEventType && type && type.trim() && type !== EventTypes.other.meeting) {
    wrappedNameComp = createHighlightedStringComponent({
      text: name,
      stringToHiglight: type,
      higlightColor: typeColor
    })
  }

  if (eventStatus === Statuses.canceled) {
    wrappedNameComp = <span className="canceled-word">CANCELED: <span className="canceled">{name}</span></span>
  }

  if (eventStatus === Statuses.moved) {
    wrappedNameComp = <span className="moved-word">MOVED: <span className="canceled">{name}</span></span>
  }

  return (
    <div className={className}>
      {wrappedNameComp}
    </div>
  )
}


EventName.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  size: PropTypes.oneOf(Object.keys(Sizes)).isRequired,
  height: PropTypes.number,
  eventStatus: PropTypes.oneOf(Object.keys(Statuses).map(x => Statuses[x])),
  //if true, higlihgts event type in it's name if it's part of it e.g. "Solar City Criterium" would have "Criterim"
    //higlighted with the event type color
  highlightEventType: PropTypes.bool,
}

export default EventName
