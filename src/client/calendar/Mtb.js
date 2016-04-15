import React from 'react'
import Component from 'react-pure-render/component'
import Calendar from './Calendar.jsx'
import {mtbEvents} from 'temp/events.js'
import Grid from 'styles/grid'


export default class Mtb extends Component {

  render() {
    const {containerWidth} = this.props
    let weekdaysSizes

    if (containerWidth < Grid.ContainerWidth.SM) {
      weekdaysSizes = [1, 1, 2, 2, 2, 3, 3]
    } else {
      weekdaysSizes = [2, 2, 2, 2, 2, 2, 2]
    }

    return (
      <div>
        <Calendar location="NorCal"
          discipline="MTB"
          name="Calendar"
          year={2016}
          events={mtbEvents}
          containerWidth={containerWidth}
          weekdaysSizes={weekdaysSizes}/>
      </div>
    )
  }
}
