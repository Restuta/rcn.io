import React, {PropTypes} from 'react'
import Sizes from './card-sizes'
import classnames from 'classnames'
import './EventName.scss'
import {Statuses} from 'temp/events'

const EventName = (props) => {
  const {name, size, height, eventStatus, classNames} = props
  const className = classnames(`EventName size-${size} size-${size}-${height} fix-fout`,
    classNames)

  // const {typeColor} = props
  //
  // const createWrappedNameComponent = (name, stringToWrap, color) => {
  //   if (name && name.indexOf(stringToWrap) !== -1) {
  //     const parts = name.split(stringToWrap)
  //     return [parts[0], <span key={0} style={{color: color}}>{stringToWrap}</span>, parts[1]] //eslint-disable-line react/jsx-key
  //   }
  //   return name //TODO restuta: funtcion returns different types based on the flow, fix this
  // }

  //TODO: make this production ready
  let wrappedNameComp = name
  // wrappedNameComp = createWrappedNameComponent(name, 'Road Race', typeColor)
  // wrappedNameComp = createWrappedNameComponent(wrappedNameComp, 'Criterium', typeColor)
  // //wrappedNameComp = createWrappedNameComponent(wrappedNameComp, 'Crit', typeColor)
  // wrappedNameComp = createWrappedNameComponent(wrappedNameComp, 'Circuit Race', typeColor)
  // wrappedNameComp = createWrappedNameComponent(wrappedNameComp, 'Time Trial', typeColor)

  if (eventStatus === Statuses.Cancelled) {
    wrappedNameComp = <span>CANCELED: <span className="cancelled">{name}</span></span>
  }

  return (
    <div className={className}>
      {wrappedNameComp}
    </div>
  )
}


EventName.propTypes = {
  name: PropTypes.string,
  size: PropTypes.oneOf(Object.keys(Sizes)).isRequired,
  height: PropTypes.number,
  eventStatus: PropTypes.oneOf(Object.keys(Statuses))
}

export default EventName
