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

  onUploadProgress = () => {
    console.info(arguments)
  }

  handleFinishedUpload = (object, file) => {
    console.info(object.publicUrl)
  }

  onPreProcess = (file, next) => {
    return next(file)
  }

  onError = (error) => {
    this.setState({
      hasError: true,
      errorMsg: error
    })
    console.info(error)
  }

  render() {
    const { fileName } = this.props
    const { hasError, errorMsg } = this.state

    const uploaderStyle = {
      height: 200,
      borderStyle: 'dashed',
      borderWidth: 2,
      borderColor: hasError ? Colors.red300 : Colors.grey500,
      backgroundColor: hasError ? Colors.red50 : Colors.grey200,
      borderRadius: 5,
      position: 'relative',
      cursor: 'pointer',
    }

    const activeStyle =  {
      borderStyle: 'solid',
      backgroundColor: hasError ? Colors.red100 : Colors.grey200,
    }

    const uploaderTextStyle = {
      width: '100%',
      height: '100%',
      // background: Colors.grey200,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }

    const errorMsgStyle = {
      color: Colors.red500
    }

    const uploaderProps = {
      hideErrorMessage: true,
      style: uploaderStyle,
      activeStyle: activeStyle,
      maxFileSize: 1024 * 1024 * 50,
      server: (process.env.NODE_ENV === 'development')
        ? 'http://localhost:3888'
        : '', //same domain in production, so leaving empty
      contentDisposition: `inline; filename="${fileName}"`,
      signingUrlQueryParams: {
        fileName: fileName,
      },
    }

    return (
      <div className="FlyerUploader">
        <DropzoneS3Uploader
          onFinish={this.handleFinishedUpload}
          onError={this.onError}
          onProgress={this.onUploadProgress}
          preprocess={this.onPreProcess}
          {...uploaderProps}>
          <div style={uploaderTextStyle}>
            <span className="text-6 secondary">
              <Icon name="cloud_upload" size={5}/> Drop Flyer Here
            </span>
            <div className="text-3 secondary">(or click to select)</div>
          </div>
        </DropzoneS3Uploader>
        {hasError && (
          <div className="text-4" style={errorMsgStyle}>{errorMsg}</div>
        )}
      </div>
    )
  }
}

FlyerUploader.propTypes = {
  fileName: PropTypes.string,
  enabled: PropTypes.bool,

}
