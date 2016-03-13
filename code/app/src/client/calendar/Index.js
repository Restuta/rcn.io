import React from 'react'
import Component from 'react-pure-render/component'
import Calendar from './Calendar.jsx'

export default class Home extends Component {

  render() {
    return (
      <div>
        <Calendar name="NCNCA Calendar" year={2016}
          containerWidth={this.props.containerWidth}
          weekdaysSizes={[2, 2, 2, 2, 2, 2, 2]}/>
      </div>
    )
  }
}
