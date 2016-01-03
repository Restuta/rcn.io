import React from 'react'
import Component from 'react-pure-render/component'
import Row from '../atoms/Row.jsx'
import Col from '../atoms/Col.jsx'
import EventStub from '../temp/EventStub.jsx'
import Typography from '../styles/typography'


export default class WeekExample extends Component {
  render() {
    const {days, allSameSize} = this.props
    const numberOfColumns = 14
    const daysSum = days.reduce((x, y) => x + y)
    let firstColumnOffset = 0

    if (daysSum < numberOfColumns) {
      firstColumnOffset = numberOfColumns - daysSum
    }

    const colClasses = allSameSize ? 'col outlined debug pink' : 'col outlined debug'

    const daysStyleLeft = {
      textAlign: 'center',
      position: 'absolute',
      marginLeft: '-70px',
      fontSize: '11px',
      fontWeight: '900',
      borderBottom: '3px solid lightgrey'
    }

    const daysStyleRight = Object.assign({}, daysStyleLeft, {
      marginLeft: '10px',
    })

    const rowStyle = { marginTop: -1 }

    let random = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    const generateRandomEvents = () => {
      let numberOfEvents = 0

      //unevently distribute probabilities, making 3 and 4 more rare guests
      if (random(1, 3) >= 3) {
        numberOfEvents = random(1, 4)
      } else {
        numberOfEvents = random(1, 2)
      }

      let events

      switch (numberOfEvents) {
        case 1:
          events = [<EventStub key={1} className="margin-bot"/>]
          break
        case 2:
          events = [
            <EventStub key={1}/>,
            <EventStub key={2} className="margin-top margin-bot"/>
          ]
          break
        case 3:
          events = [
            <EventStub key={1} />,
            <EventStub key={2} className="margin-top"/>,
            <EventStub key={3} className="margin-top margin-bot"/>
          ]
          break
        case 4:
          events = [
            <EventStub key={1} />,
            <EventStub key={2} className="margin-top"/>,
            <EventStub key={3} className="margin-top"/>,
            <EventStub key={4} className="margin-top margin-bot"/>
          ]
          break
        default:
          events = null
      }

      return events
    }


    return (
        <Row className="WeekExample" style={rowStyle}>
          <span style={daysStyleLeft}>{days.join(' ')}</span>
          {days.map((x, i) =>
            <Col xsOffset={i === 0 ? firstColumnOffset : null} key={i} sm={x}
                className={colClasses}>
              <b>{++i}</b>
              {generateRandomEvents()}
            </Col>)
          }
          <span style={daysStyleRight}>{days.join(' ')}</span>
        </Row>
    )
  }
}
