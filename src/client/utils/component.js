import React from 'react'

const createHighlightedStringComponent = (name, stringToWrap, color) => {
  if (name && name.indexOf(stringToWrap) !== -1) {
    const parts = name.split(stringToWrap)
    return [parts[0], <span key={0} style={{color: color}}>{stringToWrap}</span>, parts[1]] //eslint-disable-line react/jsx-key
  }
  return name //TODO restuta: funtction returns different types based on the flow, fix this
}

export {
  createHighlightedStringComponent
}
