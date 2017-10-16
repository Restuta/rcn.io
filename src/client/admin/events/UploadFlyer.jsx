import React from 'react'
import FlyerUploader from './FlyerUploader.jsx'
import Alert from 'atoms/Alert.jsx'
import PermitNumberInput from './PermitNumberInput.jsx'
import Col from 'atoms/Col.jsx'
import Row from 'atoms/Row.jsx'
import Flyer from 'calendar/events/event-details/Flyer.jsx'

const PERMIT_PREFIX = new Date().getFullYear() + '-'
const DEFAULT_PERMIT_NAME = PERMIT_PREFIX + 'XXX'

const getS3FlyerUrl = permit => (`https://rcn-io.s3.amazonaws.com/ncnca/flyers/flyer-${permit.trim()}.pdf`)
const getUsacFlyerUrl = permit => (`https://www.usacycling.org/events/getflyer.php?permit=${permit.trim()}`)
const permitIsValid = permit => !!(permit.match(/^2\d{3}-\d+$/g))

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

        <Row>
          <Col sm={8}><FlyerUploader fileName={fileName}/></Col>
          <Col sm={3}>
            <h4 className="margin top-0">Flyer for {permitNumber} on USAC</h4>
            <Flyer showHeader={false} url={permitIsValid(permitNumber) && getUsacFlyerUrl(permitNumber)}
              heightRem={60} showBorder/>
          </Col>
          <Col sm={3}>
            <h4 className="margin top-0">Previously uploaded flyer for {permitNumber}</h4>
            <Flyer showHeader={false} url={permitIsValid(permitNumber) && getS3FlyerUrl(permitNumber)}
              heightRem={60} showBorder/>
          </Col>
        </Row>

      </div>
    )
  }
}

UploadFlyer.propTypes = {}
