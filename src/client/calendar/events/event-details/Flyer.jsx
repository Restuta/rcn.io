import React, { PropTypes } from 'react'
import Component from 'react-pure-render/component'
import { addUrlParams } from 'utils/url-utils'
import Button from 'atoms/Button.jsx'
import Spinner from 'atoms/Spinner.jsx'
import './Flyer.scss'

export default class Flyer extends Component {
  constructor(props) {
    super(props)
    this.onOpenInNewTabClick = this.onOpenInNewTabClick.bind(this)
  }

  onOpenInNewTabClick() {
    window.open(this.props.url)
  }

  onLoad(e) {
    e.target.className += ' loaded'
  }

  render() {
    const { url } = this.props
    // 'https://drive.google.com/viewerng/viewer'
    // 'https://docs.google.com/viewer'
    const googleViewerUrl = addUrlParams('https://drive.google.com/viewerng/viewer', {
      embedded: true,
      url: url
    })
    const style = {
      width: '100%',
      height: '110rem'
    }

    const googleViewerIframe = (
      <div className="Flyer">
        <div className="Flyer-header-container">
          <h3 className="header-regular header-flyer">FLYER</h3>
          <div className="button-group">
            {/* <Button size="sm" icon="file_download" type="secondary" /> */}
            <Button size="sm" icon="open_in_new" type="secondary" onClick={this.onOpenInNewTabClick}/>
          </div>
        </div>
        <hr className="spacer no-margin-top" />
        <div className="iframe-container">
          <iframe style={style} height='100%' className="Flyer-iframe" frameBorder="0"
            src={googleViewerUrl} onLoad={this.onLoad}>
          </iframe>
          <Spinner size={2} className="Flyer-spinner"/>
        </div>
      </div>
    )

    return (
      url
        ? googleViewerIframe
        : <div className="text-2 secondary">No flyer (yet?)</div>
    )
  }
}

Flyer.propTypes = {
  url: PropTypes.string,
}
