import React from 'react'
import PropTypes from 'prop-types'
import DropzoneS3Uploader from 'restuta-react-dropzone-s3-uploader'
import Colors from 'styles/colors'
import Icon from 'atoms/Icon.jsx'
import moment from 'moment'
import Badge from 'calendar/badges/Badge.jsx'
import CopyToClipboardButton from 'atoms/CopyToClipboardButton.jsx'

const bytesToMb = bytes => (Math.round(((bytes || 0) / 1024 / 1024) * 100) / 100)

const createUploadedFileInfo = (size, url, date) => ({size, url, date})

const saveFilesToLocalStorage = uploadedFiles =>
  // window.localStorage.setItem('recentlyUploadedFiles', JSON.stringify(uploadedFiles))
  window.localStorage.setItem('recentlyUploadedFiles', JSON.stringify(
    uploadedFiles.map(file => ({
      ...file,
      date: file.date.toJSON(),
    }))
  ))

const getFilesFromLocalStorage = () => {
  const previouslyStoredFiles = window.localStorage.getItem('recentlyUploadedFiles')

  return previouslyStoredFiles
    ? JSON.parse(previouslyStoredFiles)
        .map(x => ({
          ...x,
          date: moment(x.date)
        }))
    : []
}


//statefull component!, since Redux is overkill here
//uploads flyers to Amazon S3, renders drag and drop area
export default class FlyerUploader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      errorMsg: '',
      uploadedFiles: getFilesFromLocalStorage() || []
    }
  }

  onUploadProgress = (percent, status, file) => {
    // console.info(...arguments)
  }

  handleFinishedUpload = (object, file) => {
    this.setState({
      uploadedFiles: [
        createUploadedFileInfo(file.size, object.publicUrl, moment()),
        ...this.state.uploadedFiles
      ]
    }, () => saveFilesToLocalStorage(this.state.uploadedFiles))
  }

  // onPreProcess = (file, next) => {
  //   return next(file)
  // }

  onError = (error) => {
    this.setState({
      hasError: true,
      errorMsg: error
    })
  }

  render() {
    const { fileName } = this.props
    const { hasError, errorMsg, uploadedFiles } = this.state

    const uploaderStyle = {
      height: 200,
      borderStyle: 'dashed',
      borderWidth: 2,
      borderColor: hasError ? Colors.red300 : Colors.grey500,
      backgroundColor: hasError ? Colors.red50 : Colors.grey100,
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

    const recentlyUploadedStyle = {
      transition: 'all 0.5s ease',
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
            <div className="text-3 secondary">or <a>browse</a></div>
          </div>
        </DropzoneS3Uploader>
        {hasError && (
          <div className="text-4" style={errorMsgStyle}>{errorMsg}</div>
        )}

        {(uploadedFiles.length > 0) && (
          <div>
            <h3 className="text-uppercase">Recently Uploaded <span style={{color: 'silver'}}>(from this browser)</span></h3>
            <ul className="list-group" style={recentlyUploadedStyle}>
              {uploadedFiles.map((file, i) =>
                <li key={i} className="list-group-item" style={recentlyUploadedStyle}>
                  <Badge heightRem={3}>{bytesToMb(file.size)}Mb</Badge>&nbsp;&nbsp;&nbsp;
                  <span>{file.date.fromNow()}&nbsp;&nbsp;&nbsp;</span>
                  <a id={`uploaded-file-url-${i}`} href={file.url}>{file.url}&nbsp;&nbsp;&nbsp;&nbsp;</a>
                  <CopyToClipboardButton type="link" textElementId={`uploaded-file-url-${i}`} />
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    )
  }
}

FlyerUploader.propTypes = {
  fileName: PropTypes.string,
  enabled: PropTypes.bool,

}
