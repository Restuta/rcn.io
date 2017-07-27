import React from 'react'
import PropTypes from 'prop-types'
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
    const {
      url,
      showHeader = true,
      showBorder = false,
      heightRem = 110
    } = this.props

    // 'https://drive.google.com/viewerng/viewer'
    // 'https://docs.google.com/viewer'
    const googleViewerUrl = addUrlParams('https://drive.google.com/viewerng/viewer', {
      embedded: true,
      url: url
    })
    const style = {
      width: '100%',
      height: `${heightRem}rem`,
      border: showBorder ? '1px solid silver' : 'none',
    }

    const googleViewerIframe = (
      <div className="Flyer">
        {showHeader && (
          <div>
            <div className="Flyer-header-container">
              <h3 className="header-regular header-flyer">FLYER</h3>
              <div className="button-group">
                {/* <Button size="sm" icon="file_download" type="secondary" /> */}
                {/* //TODO: deffirintiate open in same window or different one for mobile and web, same for mobile */}
                <Button link size="sm" icon="fullscreen" type="secondary" href={url}>
                  FULL SIZE
                </Button>
              </div>
            </div>
            <hr className="spacer no-margin-top" />
          </div>
        )}
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
  showHeader: PropTypes.bool,
  showBorder: PropTypes.bool,
  url: PropTypes.string,
  heightRem: PropTypes.string,
}
