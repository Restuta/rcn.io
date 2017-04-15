import React from 'react'
import Button from 'atoms/Button.jsx'
import { generatePrettyEventId } from 'shared/events/gen-event-id'
import CopyToClipboardButton from 'atoms/CopyToClipboardButton.jsx'

const last = arr => arr[arr.length - 1]

export default class CreateEventId extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      generatedName: '',
      year: 2017,
      prefix: 'ncnca',
      name: '',
      textCopied: false,
    }
  }

  updateState = ({
    year = this.state.year,
    prefix = this.state.prefix,
    name = this.state.name
  }) => {
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

  onYearChange = (event) => {
    this.updateState({year: event.target.value})
  }

  onPrefixChange = (event) => {
    this.updateState({prefix: event.target.value})
  }

  onEventNameChange = (event) => {
    this.updateState({name: event.target.value})
  }

  onRegenerateClick = (event) => {
    this.updateState({})
  }

  render() {
    const eventShortId = last(this.state.generatedName.split('-'))

    return (
      <div className="CreateEventId">

        <form>
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
            <CopyToClipboardButton textElementId="generated-name"/>
            <br />
            <div id="name-help" className="form-text text-muted">Don't forget to set <b>"_shortId"</b> property to last part
              after "-" of this generated id, which is "{eventShortId}" in this case:
              <pre className="margin bot-0">{`{ _shortId: "${eventShortId}"}`}</pre>
              on your event.
            </div>

            <div style={{marginTop: '1rem'}}>
              <Button icon="autorenew" size="sm" type="secondary" onClick={this.onRegenerateClick}>
                REGENERATE
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }
}

CreateEventId.propTypes = {}
