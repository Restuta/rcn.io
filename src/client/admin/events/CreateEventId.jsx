import React from 'react'
import Button from 'atoms/Button.jsx'
import { generatePrettyEventId } from 'shared/events/gen-event-id'
import CopyToClipboardButton from 'atoms/CopyToClipboardButton.jsx'
import EventCode from './EventCode.jsx'
import Grid from 'styles/grid'
import Col from 'atoms/Col.jsx'
import Row from 'atoms/Row.jsx'
import Event from 'calendar/events/Event.jsx'
import { EventDetails } from 'calendar/events/event-details/EventDetails.jsx'
import { createEvent } from 'temp/events'
import createEventCode from './event-template'

const last = arr => arr[arr.length - 1]

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

    const eventCode = createEventCode({
      id: generatedId,
      name,
      shortId: eventShortId
    })

    // eslint-disable-next-line no-eval
    const event = createEvent(eval(`(${eventCode})`))

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
              <Row>
                <Col xs={7}>
                  <EventCode id="event-code"
                    code={eventCode}
                  />
                </Col>
                <Col xs={7}>
                  <div style={{display: 'flex', flexDirection: 'row'}}>
                    <div className="margin rgt-4">
                      <h4 className="margin top-0">DESKTOP VIEW</h4>
                      <Event event={event} debug fixedWidth widthColumns={2} baseHeight={6}
                        containerWidth={Grid.ContainerWidth.XXL}/>
                    </div>
                    <div>
                      <h4 className="margin top-0">IPHONE VIEW</h4>
                      <Event event={event} debug fixedWidth width={'91px'} widthColumns={4} autoHeight={false}
                        baseHeight={2} containerWidth={Grid.ContainerWidth.XS}/>
                    </div>
                  </div>
                  <h4>FULL VIEW</h4>
                  <EventDetails event={event} eventId={event.id}/>
                </Col>
              </Row>

              <CopyToClipboardButton textElementId="event-code" whatToCopyText="JSON"/>
            </div>
          </div>
        )}
      </div>
    )
  }
}

CreateEventId.propTypes = {}
