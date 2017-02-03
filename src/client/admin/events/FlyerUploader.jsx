import React, { PropTypes } from 'react'
import DropzoneS3Uploader from 'restuta-react-dropzone-s3-uploader'
import Colors from 'styles/colors'
import Icon from 'atoms/Icon.jsx'

//statefull component!, since Redux is overkill here
//uploads flyers to Amazon S3, renders drag and drop area
export default class FlyerUploader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      errorMsg: '',
      uploadedFilesUrls: []
    }
  }


  handleFinishedUpload = (object, file) => {
    console.info(object.publicUrl)
  }

  onPreProcess = (file, next) => {
    return next(file)
  }

  onError = () => {
    console.info(...arguments)
  }

  render() {
    const { fileName } = this.props

    const uploaderStyle = {
      height: 200,
      borderStyle: 'dashed',
      borderWidth: 2,
      borderColor: '#999',
      borderRadius: 5,
      position: 'relative',
      cursor: 'pointer',
    }

    const activeStyle =  {
      borderStyle: 'solid',
      backgroundColor: '#eee',
    }

    const uploaderProps = {
      style: uploaderStyle,
      activeStyle: activeStyle,
      maxFileSize: 1024 * 1024 * 50,
      server: (process.env.NODE_ENV === 'development') ? 'http://localhost:3889' : '',
      contentDisposition: `inline; filename="${fileName}"`,
      signingUrlQueryParams: {
        fileName: fileName,
      },
    }

    const uploaderTextStyle = {
      width: '100%',
      height: '100%',
      background: Colors.grey200,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }

    return (
      <div className="FlyerUploader">
        <DropzoneS3Uploader
          onFinish={this.handleFinishedUpload}
          onError={this.onError}
          preprocess={this.onPreProcess}
          {...uploaderProps}>
          <div style={uploaderTextStyle}>
            <span className="text-6 secondary">
              <Icon name="cloud_upload" size={5}/> Drop Flyer Here
            </span>
            <div className="text-3 secondary">(or click to select)</div>
          </div>
        </DropzoneS3Uploader>
      </div>
    )
  }
}

FlyerUploader.propTypes = {
  fileName: PropTypes.string,
  enabled: PropTypes.bool,

}
