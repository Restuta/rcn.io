import React from 'react'
import Component from 'react-pure-render/component'
import Calendar from './Calendar.jsx'
import {mtbEvents} from 'temp/events.js'

export default class Home extends Component {

  render() {
    return (
      <div>
        <Calendar location="NorCal"
          eventsTypeName="MTB"
          name="Calendar"
          year={2016}
          events={mtbEvents}
          containerWidth={this.props.containerWidth}
          weekdaysSizes={[2, 2, 2, 2, 2, 2, 2]}/>
      </div>
    )
  }
}
