import React from 'react'

//highlights given string in a given text with a given color by means of creating an array of components
//or returns passed string if nothing to highlight
const createHighlightedStringComponent = ({text, stringToHiglight, higlightColor}) => {
  if (higlightColor === 'white') {
    return text
  }

  if (text && text.indexOf(stringToHiglight) !== -1) {
    const parts = text.split(stringToHiglight)
    return [parts[0], <span key={0} style={{color: higlightColor}}>{stringToHiglight}</span>, parts[1]] //eslint-disable-line react/jsx-key
  }
  return text //TODO restuta: funtction returns different types based on the flow, fix this
}

export {
  createHighlightedStringComponent
}
