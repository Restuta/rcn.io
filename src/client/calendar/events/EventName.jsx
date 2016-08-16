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
  let wrappedNameComp = name

  if (type && type.trim()) {
    wrappedNameComp = createHighlightedStringComponent(name, type, typeColor)
  }

  if (eventStatus === Statuses.canceled) {
    wrappedNameComp = <span>CANCELED: <span className="canceled">{name}</span></span>
  }

  if (eventStatus === Statuses.moved) {
    wrappedNameComp = <span>MOVED: <span className="canceled">{name}</span></span>
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
