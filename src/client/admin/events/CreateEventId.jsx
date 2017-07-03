import React from 'react'
import Button from 'atoms/Button.jsx'
import { generatePrettyEventId } from 'shared/events/gen-event-id'
import CopyToClipboardButton from 'atoms/CopyToClipboardButton.jsx'

const last = arr => arr[arr.length - 1]

const EventCode = ({id, code, eventName, eventId, eventShortId}) => (
  <pre id={id} style={{
    boxShadow: '0 5px 31px 0 rgba(0, 0, 0, 0.13)',
    borderRadius: '0.375rem',
    padding: '2rem',
  }}>
    {`{
    "id": "${eventId}",
    "name": "${eventName}",
    "status": "", // Canceled or Moved
    // "cancelationReason" : "plain text reason given by promoter",
    // "movedToEventId": "id of event it is moved to or leave empty",
    "type": "",
    "discipline": "",
    "date": "",
    "usacPermit": "",
    "location": {
      // "name": "",
      "streetAddress": "",
      "city": "",
      "state": "",
      // "zip": "",
      // "lat": null,
      // "long": null
    },
    // "websiteUrl": null,
    // "resultsUrl": null,
    // "promoters": [],
    // "promoterInfo": null,
    // "registrationUrl": "",
    // "flyer": {
    //   "name": "",
    //   "url": "",
    //   "mimeType": "application/pdf"
    // },
    // "series": [],
    "isDraft" : false,
    "_shortId" : "${eventShortId}"
  }, `}
  </pre>
)

export default class CreateEventId extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      generatedId: '',
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
      generatedId: (year && name && prefix)
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
    const { year, prefix, name, generatedId } = this.state
    const eventShortId = last(generatedId.split('-'))

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
              value={year}/>
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
              value={prefix}/>
            <small id="prefix-help" className="form-text text-muted">Can be a shortened calendar or organization name</small>
          </div>
          <div className="form-group">
            <label htmlFor="input-year">Name</label>
            <input id="input-event-name"
              type="text"
              onChange={this.onEventNameChange}
              className="form-control"
              placeholder="Enter Event Name"
              value={name}/>
            <small id="name-help" className="form-text text-muted">Just paste event name as is</small>
          </div>
        </form>

        {generatedId && (
          <div>
            <div>
              <h3>NEW EVENT ID:</h3>
              <mark id="generated-name" style={{
                padding: '1rem 1rem',
                marginRight: '1rem',
                display: 'inline-block'
              }}>
                {generatedId}
              </mark>
              <CopyToClipboardButton textElementId="generated-name" whatToCopyText="ID"/>
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
            <div style={{marginBottom: '8rem'}}>
              <h3>EVENT JSON</h3>
              <div className="margin bot-2" />
              <EventCode id="event-code"
                eventName={name}
                eventId={generatedId}
                eventShortId={eventShortId}
              />
              <CopyToClipboardButton textElementId="event-code" whatToCopyText="JSON"/>
            </div>
          </div>
        )}
      </div>
    )
  }
}

CreateEventId.propTypes = {}
