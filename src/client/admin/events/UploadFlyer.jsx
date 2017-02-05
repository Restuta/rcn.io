import React, { PropTypes } from 'react'
import Component from 'react-pure-render/component'
import FlyerUploader from './FlyerUploader.jsx'

export default class UploadFlyer extends Component {
  render() {

    return (
      <div className="UploadFlyer">
        <FlyerUploader fileName="flyer-2017-3456.pdf"/>
      </div>
    )
  }
}

UploadFlyer.propTypes = {}
