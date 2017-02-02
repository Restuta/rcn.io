import React from 'react'
import Button from 'atoms/Button.jsx'
import { generatePrettyEventId } from 'shared/events/gen-event-id'
import Colors from 'styles/colors'
import Icon from 'atoms/Icon.jsx'

import DropzoneS3Uploader from 'restuta-react-dropzone-s3-uploader'

function selectText(element) {
  const text = document.getElementById(element)
  let range
  let selection

  if (document.body.createTextRange) {
    range = document.body.createTextRange()
    range.moveToElementText(text)
    range.select()
  } else if (window.getSelection) {
    selection = window.getSelection()
    range = document.createRange()
    range.selectNodeContents(text)
    selection.removeAllRanges()
    selection.addRange(range)
  }
}

export default class CreateEventId extends React.Component {
  constructor(props) {
    super(props)
    this.onEventNameChange = this.onEventNameChange.bind(this)
    this.onYearChange = this.onYearChange.bind(this)
    this.onPrefixChange = this.onPrefixChange.bind(this)
    this.onCopyClick = this.onCopyClick.bind(this)
    this.onRegenerateClick = this.onRegenerateClick.bind(this)

    this.updateState = this.updateState.bind(this)
    this.state = {
      generatedName: '',
      year: 2017,
      prefix: 'ncnca',
      name: '',
      textCopied: false,
    }
  }

  updateState({year = this.state.year, prefix = this.state.prefix, name = this.state.name}) {
    this.setState({
      year: year,
      prefix: prefix,
      name: name,
      textCopied: false,
      generatedName: (year && name && prefix)
        ? generatePrettyEventId(year, name, prefix)
        : ''
    })
  }

  onYearChange(event) {
    this.updateState({year: event.target.value})
  }

  onPrefixChange(event) {
    this.updateState({prefix: event.target.value})
  }

  onEventNameChange(event) {
    this.updateState({name: event.target.value})
  }

  onCopyClick(event) {
    try {
      selectText('generated-name')
      // copy text
      document.execCommand('copy')
      this.setState({ textCopied: true })
    } catch (err) {
      this.setState({ textCopied: false })
      alert('please press Ctrl/Cmd+C to copy')
    }
  }

  onRegenerateClick(event) {
    this.updateState({})
  }

  handleFinishedUpload(object, file) {
    console.info(object)
  }

  onPreProcess(file, next) {
    return next(file)
  }

  render() {
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
      server: 'http://localhost:3888',
      contentDisposition: 'inline; filename="file.pdf"',
      signingUrlQueryParams: {
        fileName: 'flyer-2017-203.pdf',
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
      <div className="CreateEventId">

        <form>
          <div className="form-group">
            <div className="form-group">
              <label htmlFor="input-year">Year</label>
              <input id="input-year"
                type="number"
                style={{width: '10rem'}}
                onChange={this.onYearChange}
                className="form-control"
                placeholder="year"
                value={this.state.year}/>
              <small id="year-help" className="form-text text-muted">Year event is taking place in</small>
            </div>
            <div className="form-group">
              <label htmlFor="input-year">Prefix</label>
              <input id="input-prefix"
                type="text"
                style={{width: '16rem'}}
                onChange={this.onPrefixChange}
                className="form-control"
                placeholder="Org prefix"
                value={this.state.prefix}/>
              <small id="prefix-help" className="form-text text-muted">Can be a shortened calendar or organization name</small>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="input-year">Name</label>
            <input id="input-event-name"
              type="text"
              onChange={this.onEventNameChange}
              className="form-control"
              placeholder="Enter Event Name"
              value={this.state.name}/>
            <small id="name-help" className="form-text text-muted">Just paste event name as is</small>
          </div>
        </form>

        {this.state.generatedName && (
          <div>
            <h3>New Event Id</h3>
            <mark id="generated-name" style={{
              padding: '1rem 1rem',
              marginRight: '1rem',
              display: 'inline-block'
            }}>
              {this.state.generatedName}
            </mark>
            <Button icon="assignment_return" size="sm" type="primary" onClick={this.onCopyClick}>
              {this.state.textCopied
                ? <span>COPIED</span>
                : <span>COPY</span>
              }
            </Button>
            <br />
            <small id="name-help" className="form-text text-muted">Don't forget to set "_shortId" property to last part
              after "-" of this generated id
            </small>

            <div style={{marginTop: '1rem'}}>
              <Button icon="autorenew" size="sm" type="secondary" onClick={this.onRegenerateClick}>
                REGENERATE
              </Button>
            </div>

          </div>
        )}

        <DropzoneS3Uploader
          onFinish={this.handleFinishedUpload}
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

CreateEventId.propTypes = {}
