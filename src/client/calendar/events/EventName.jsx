import React, {PropTypes} from 'react'
import Sizes from './card-sizes'
import classnames from 'classnames'
import './EventName.scss'
import { Statuses } from 'calendar/events/types'
import { createHighlightedStringComponent } from 'client/utils/component.js'

const EventName = (props) => {
  const { name, size, height, eventStatus, classNames, typeColor, type } = props
  const className = classnames(`EventName size-${size} size-${size}-${height} fix-fout`,
    classNames)

  //TODO bc: make this production ready, e.g. avoid iteration if one of the names is highlighted
  //TODO bc: only higlight true event types
  let wrappedNameComp = name

  if (type && type.trim()) {
    wrappedNameComp = createHighlightedStringComponent(name, type, typeColor)
  }

  // wrappedNameComp = createHighlightedStringComponent(name, 'Road Race', typeColor)
  // wrappedNameComp = createHighlightedStringComponent(wrappedNameComp, 'Criterium', typeColor)
  // wrappedNameComp = createHighlightedStringComponent(wrappedNameComp, 'Crits', typeColor)
  // wrappedNameComp = createHighlightedStringComponent(wrappedNameComp, 'Crit', typeColor)
  // wrappedNameComp = createHighlightedStringComponent(wrappedNameComp, 'Circuit Race', typeColor)
  // wrappedNameComp = createHighlightedStringComponent(wrappedNameComp, 'Time Trial', typeColor)
  // wrappedNameComp = createHighlightedStringComponent(wrappedNameComp, 'Hill Climb', typeColor)

  if (eventStatus === Statuses.cancelled) {
    wrappedNameComp = <span>CANCELED: <span className="cancelled">{name}</span></span>
  }

  if (eventStatus === Statuses.moved) {
    wrappedNameComp = <span>MOVED: <span className="cancelled">{name}</span></span>
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
}

export default EventName
