import React from 'react'
import Button from 'atoms/Button.jsx'
import { createPrettyEventId, createShortEventId } from 'shared/events/gen-event-id'
import CopyToClipboardButton from 'atoms/CopyToClipboardButton.jsx'

import Col from 'atoms/Col.jsx'
import Row from 'atoms/Row.jsx'

import { createEvent } from 'temp/events'
import createEventCode from './event-template'
import CodeMirror from 'react-codemirror'
import 'admin/styles/codemirror.scss'
import 'codemirror/mode/javascript/javascript'
import { first } from 'lodash'
// import Alert from 'atoms/Alert.jsx'
import EventPreview from './EventPreview.jsx'
// import EventCode from './EventCode.jsx'

/* TODO BC:
  - rename component
  - split into components
  - sync name in text boxes
  - user test with Helen
  - fix bug with editing of event name, since it's delayed by one characters
  - fix copy to clipboard
  - fix bug with editing of event id
  - add Joi validation
    - do not create event from JSON if validation fails
    - now date doesn't work since it's invalid for empty event
*/

const createEventFromCode = code => {
  let event

  try {
    // eslint-disable-next-line no-eval
    event = createEvent(eval(`(${code})`))
  } catch (e) {
    // eslint-disable-next-line
    console.warn('Invalid JSON, can\'t create event')
    // eslint-disable-next-line
    console.warn(e)
  }

  return event
}


const getCodeMirrorTextArea = () => {
  const reactCodeMirrorElement = first(document.getElementsByClassName('ReactCodeMirror'))

  if (!reactCodeMirrorElement) {
    return undefined
  }

  return reactCodeMirrorElement.firstChild
}

export default class CreateEventId extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      generatedId: '',
      year: 2017,
      prefix: 'ncnca',
      name: '',
      textCopied: false,
      event,
      eventShortId: createShortEventId(),
      eventCode: createEventCode({
        id: '',
        name: '',
        shortId: ''
      }),
      eventJsonHasBeenCreated: false,
    }
  }

  componentDidMount() {
    this.codeMirrorTextArea = getCodeMirrorTextArea()
  }

  updateState = ({
    year = this.state.year,
    prefix = this.state.prefix,
    name = this.state.name,
    event = this.state.event,
    eventCode = this.state.eventCode,
    eventShortId = this.state.eventShortId,
    eventJsonHasBeenCreated = this.state.eventJsonHasBeenCreated,
  }) => {
    const generatedId = (year && name && prefix)
      ? createPrettyEventId(year, name, prefix, eventShortId)
      : ''

    // if manually modfied then do not re-create, so we don't loose the data
    //
    // const newEventCode = eventJsonHasBeenCreated
    //   ? eventCode
    //   : createEventCode({
    //     id: generatedId,
    //     name: name,
    //     shortId: eventShortId
    //   })

    const prevEvent = createEventFromCode(eventCode)

    const newEventCode = eventCode !== this.state.eventCode
      ? eventCode
      : createEventCode({
        id: generatedId,
        name: name,
        shortId: eventShortId,
        event: prevEvent,
      })

    const newEvent = newEventCode !== this.state.eventCode
      ? createEventFromCode(newEventCode) || event
      : event


    const newEventName = (eventJsonHasBeenCreated)
      ? (newEvent ? newEvent.name : name)
      : name

    this.setState({
      year,
      prefix,
      name: newEventName,
      textCopied: false,
      generatedId,
      event: newEvent,
      eventShortId,
      eventCode: newEventCode,
      eventJsonHasBeenCreated,
    })
  }

  onYearChange = (e) => this.updateState({ year: e.target.value })
  onPrefixChange = (e) => this.updateState({ prefix: e.target.value })
  onEventNameChange = (e) => this.updateState({ name: e.target.value })
  onCreateNewEventJsonClick = () => this.updateState({ eventJsonHasBeenCreated: true })

  onCodeMirrorChange = (newCode) =>
    this.updateState({ eventCode: newCode })

  render() {
    const {
      year,
      prefix,
      name,
      generatedId,
      eventCode,
      event,
      eventShortId,
      eventJsonHasBeenCreated,
    } = this.state

    const shouldDisableInputs = false //eventJsonHasBeenCreated

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
              disabled={shouldDisableInputs}
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
              disabled={shouldDisableInputs}
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
              disabled={shouldDisableInputs}
              value={name}/>
            <small id="name-help" className="form-text text-muted">Just paste or enter event name as is</small>
          </div>
        </form>

        {generatedId && (
          <div>
            <div>
              <h3>EVENT ID</h3>
              <mark id="generated-name" style={{
                padding: '1rem 1rem',
                marginRight: '1rem',
                display: 'inline-block'
              }}>
                {generatedId}
              </mark>
              <CopyToClipboardButton textElementId="generated-name" whatToCopyText="ID" buttonType="secondary"/>
              <br />
              <div id="name-help" className="form-text text-muted">
                {eventJsonHasBeenCreated
                  ? ('Copy-paste this id to JSON after you change the name.')
                  : ( //eslint-disable-next-line
                    <span>Don't forget to set <b>"_shortId"</b> property to last part
                      after "-" of this generated id, which is "{eventShortId}" in this case:
                      <pre className="margin bot-0">{`{ _shortId: "${eventShortId}"}`}</pre>
                      on your event.
                    </span>
                  )
                }

              </div>

              <div style={{marginTop: '1rem'}}>
                <Button icon="forward" size="sm"
                  type="primary"
                  // disabled={eventJsonHasBeenCreated}
                  onClick={this.onCreateNewEventJsonClick}>
                  CREATE NEW EVENT JSON
                </Button>
              </div>
              <span id="prefix-help" className="form-text text-muted">
                After event JSON is created you won't be able to auto-generate it's Id based on name.
              </span>
            </div>
          </div>
        )}

        {eventJsonHasBeenCreated && (

          <div>
            <div style={{marginBottom: '8rem'}}>
              <Row style={{flexWrap: 'nowrap'}}>
                <Col xs={7}>
                  <h3>EVENT JSON</h3>
                  <CodeMirror
                    value={eventCode}
                    onChange={this.onCodeMirrorChange}
                    options={{
                      mode: {
                        name: 'javascript',
                        json: true,
                      },
                      lineWrapping: true,
                      lineNumbers: true,
                    }}
                  />
                </Col>
                <Col xs={7}>
                  <EventPreview event={event} />
                </Col>
              </Row>

              <CopyToClipboardButton domElement={this.codeMirrorTextArea} whatToCopyText="EVENT JSON"/>
            </div>
          </div>
        )}
      </div>
    )
  }
}

CreateEventId.propTypes = {}
