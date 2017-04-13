import React from 'react'
import FlyerUploader from './FlyerUploader.jsx'
import Alert from 'atoms/Alert.jsx'
import PermitNumberInput from './PermitNumberInput.jsx'

const PERMIT_PREFIX = new Date().getFullYear() + '-'
const DEFAULT_PERMIT_NAME = PERMIT_PREFIX + 'XXX'

const getS3FlyerUrl = permit => (`https://rcn-io.s3.amazonaws.com/ncnca/flyers/flyer-${permit}.pdf`)
const getUsacUrl = permit => (`https://www.usacycling.org/events/getflyer.php?permit=${permit}`)

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
          Once Permit Number is entered, uploading new flyer would replace the old one (if present)! At the same time
          it won't get removed. Flyers are versioned internally.
          (contact <a href={`mailto:a@rcn.io?subject=Please Help Restore Flyer Version – ${permitNumber}`}>a@rcn.io </a>
             to restore or better, just upload another one)
          <br /> <br />
          <div>Also note, that if Event has a permit number set, flyer would be loaded directly from USAC.</div>
        </Alert>

        <PermitNumberInput onPermitNumberChange={this.onPermitNumberChange} permitNumber={permitNumber}
          permitPrefix={PERMIT_PREFIX}/>
        <FlyerUploader fileName={fileName}/>
      </div>
    )
  }
}

UploadFlyer.propTypes = {}
