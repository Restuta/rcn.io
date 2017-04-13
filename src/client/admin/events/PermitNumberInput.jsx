import React from 'react'
import { selectTextSegment } from 'utils/dom/text'

export default class PermitNumberInput extends React.Component {
  //when text is pre-selected in an input, clicking on it removes selection sometimes, this prevents that
  onMouseUp = e => e.preventDefault()

  //select part after "<year>-" for convenience
  onPermitInputFocus = (event) =>
    selectTextSegment({elementId: 'input-permit', start: 5, end: 100})

  render() {
    const { onPermitNumberChange, permitNumber, permitPrefix } = this.props

    return (
      <div className="form-group">
        <label htmlFor="input-permit">Permit #</label>
        <input id="input-permit"
          type="text"
          style={{width: '15rem'}}
          onMouseUp={this.onMouseUp}
          onFocus={this.onPermitInputFocus}
          onChange={onPermitNumberChange}
          className="form-control"
          placeholder={`${permitPrefix}XXXX`}
          value={permitNumber}
        />
        <small id="year-help" className="form-text text-muted">
          If an event has permit id – use it, otherwise flyer would get a random name.
        </small>
      </div>
    )
  }
}
