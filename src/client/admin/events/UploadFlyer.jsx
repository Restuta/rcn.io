import React, { PropTypes } from 'react'
import FlyerUploader from './FlyerUploader.jsx'
import Alert from 'atoms/Alert.jsx'
import { selectTextSegment } from 'utils/dom/text'

const PERMIT_PREFIX = new Date().getFullYear() + '-'
const DEFAULT_PERMIT_NAME = PERMIT_PREFIX + 'XXX'

const getS3FlyerUrl = permit => (`https://rcn-io.s3.amazonaws.com/ncnca/flyers/flyer-${permit}.pdf`)
const getUsacUrl = permit => (`https://www.usacycling.org/events/getflyer.php?permit=${permit}`)

class PermitNumberInput extends React.Component {
  //when text is pre-selected in an input, clicking on it removes selection sometimes, this prevents that
  onMouseUp = e => e.preventDefault()

  //select part after "<year>-" for convenience
  onPermitInputFocus = (event) =>
    selectTextSegment({elementId: 'input-permit', start: 5, end: 100})

  render() {
    const { onPermitNumberChange, permitNumber } = this.props

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
          placeholder={`${PERMIT_PREFIX}XXXX`}
          value={permitNumber}
        />
        <small id="year-help" className="form-text text-muted">
          If an event has permit id – use it, otherwise flyer would get a random name.
        </small>
      </div>
    )
  }
}

export default class UploadFlyer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      permitNumber: DEFAULT_PERMIT_NAME,
    }
  }

  onPermitNumberChange = (event) => {
    this.setState({permitNumber: event.target.value})
  }

  //TODO bc: show alert only when flyer number is entered and flyer is present

  render() {
    const { permitNumber } = this.state
    const fileName = (permitNumber === DEFAULT_PERMIT_NAME) ? '' : `flyer-${permitNumber}.pdf`


    return (
      <div className="UploadFlyer">
        <Alert type="info" style={{marginBottom: '4rem'}}><strong>Heads up! </strong>
          Once Permit Number is entered, uploading new flyer would replace the old one (if present), but it wont get
          removed. Flyers are versioned internally.
          (contact <a href={`mailto:a@rcn.io?subject=Please Help Restore Flyer Version – ${permitNumber}`}>a@rcn.io </a>
             to restore or better, just upload another one.)
          <br /> <br />
          <div>If Event has a permit number set, flyer would be loaded directly from USAC.</div>
        </Alert>

        <PermitNumberInput onPermitNumberChange={this.onPermitNumberChange} permitNumber={permitNumber} />
        <FlyerUploader fileName={fileName}/>
      </div>
    )
  }
}

UploadFlyer.propTypes = {}
