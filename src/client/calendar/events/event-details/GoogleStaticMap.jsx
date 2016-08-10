import React, { PropTypes } from 'react'
import Component from 'react-pure-render/component'
import Colors from 'styles/colors'
import { addUrlParams } from 'utils/url-utils'
import { pxToRem } from 'styles/typography'

const hexClrToGoogleClr = hexClr => `0x${hexClr.slice(1)}`

export default class GoogleStaticMap extends Component {
  render() {
    const {
       width,
       height,
       homeAddress,
       startAddress,
       zoom,
       startAddressMarkerColor = Colors.grey400,
      } = this.props
    const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap'
    const homeMarkerColor = hexClrToGoogleClr('#000000')
    const startMarkerColor = hexClrToGoogleClr(startAddressMarkerColor)

    const genericParams = {
      format: 'png8',
      maptype: 'roadmap',
      zoom: zoom,
      markers: [
        `size:normal|color:${startMarkerColor}|label:S|${startAddress}`
      ],
      // style: [
      //   'saturation:-50|lightness:0|gamma:1.5',
      //   'feature:road.highway|element:all|visibility:simplified',
      //   'feature:water|element:all|color:0x90CAF9|visibility:on',
      //   // 'feature:water|element:all|color:0xb6dbfa|visibility:on',
      // ],
      style: [
        'feature:administrative|element:labels.text.fill|color:0x444444',
        'feature:poi|element:all|visibility:on|saturation:-100',
        'feature:road|element:all|saturation:-100|lightness:45',
        'feature:road.highway|element:all|visibility:simplified',
        'feature:road.arterial|element:labels.icon|visibility:off',
        'feature:transit|element:all|visibility:off',
        'feature:water|element:all|color:0x90CAF9|visibility:on',
        'feature:water|element:all|color:0xb6dbfa|visibility:on',
        // 'feature:water|element:all|color:0xBBDEFB|visibility:on',

      ],
      visibility: 'simplified',
      key: 'AIzaSyAzpETb1x1vce3mw_n2jnDBDlKDjZ4iH2c',
    }

    if (homeAddress) {
      genericParams.markers.push(`size:small|color:${homeMarkerColor}|label:H|${homeAddress}`)
    }

    const bigImageParams = {
      ...genericParams,
      size: `${width}x${height}`,
      scale: 2,
    }

    const midImageParams = {
      ...genericParams,
      size: `${width}x${height}`,
      scale: 1,
    }

    const style = {
      borderRadius: pxToRem(3) + 'rem'
    }

    const googleMapBigImgUrl = addUrlParams(baseUrl, bigImageParams)
    const googleMapMidImgUrl = addUrlParams(baseUrl, midImageParams)

    return (
      <div className="GoogleStaticMap intrinsic intrinsic--13x11">
        <img style={style} className="img-fluid intrinsic-item" alt="Google Map"
          src={googleMapBigImgUrl}
          srcSet={`
            ${googleMapBigImgUrl} 2x,
            ${googleMapMidImgUrl} 1x`}
          />
      </div>
    )
  }
}

GoogleStaticMap.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  homeAddress: PropTypes.string,
  startAddress: PropTypes.string,
  zoom: PropTypes.number,
  startAddressMarkerColor: PropTypes.string,
}
