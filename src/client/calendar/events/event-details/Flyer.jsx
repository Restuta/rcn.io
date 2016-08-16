import React, { PropTypes } from 'react'
import Component from 'react-pure-render/component'
import { addUrlParams } from 'utils/url-utils'
import './Flyer.scss'

export default class Flyer extends Component {
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
      <iframe style={style} height='100%' className="Flyer" frameBorder="0"
        src={googleViewerUrl} onLoad={this.onLoad}>
      </iframe>
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
