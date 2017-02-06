import React, { PropTypes } from 'react'
import Component from 'react-pure-render/component'
import FlyerUploader from './FlyerUploader.jsx'
import Alert from 'atoms/Alert.jsx'

export default class UploadFlyer extends Component {
  render() {

    return (
      <div className="UploadFlyer">
        <div className="form-group" style={{marginBottom: '2rem'}}>
          <label htmlFor="input-year">Permit #</label>
          <input id="input-year"
            type="number"
            style={{width: '15rem'}}
            // onChange={this.onYearChange}
            className="form-control"
            placeholder="2017-XXXX"
            // value={this.state.year}
          />
          <small id="year-help" className="form-text text-muted">
            If an event has permit id – use it, otherwise flyer would get random name.
          </small>
        </div>

        <Alert type="info"><strong>Heads up! </strong>
        Once permit # is entered, uploading new flyer would replace the old one (if present), but nothig
        is removed. Flyers are versioned internally.</Alert>

        <Alert type="success">Success</Alert>
        <Alert type="warning">Warning</Alert>
        <Alert type="danger">Danger</Alert>

        <FlyerUploader fileName="flyer-2017-3456.pdf"/>
      </div>
    )
  }
}

UploadFlyer.propTypes = {}
