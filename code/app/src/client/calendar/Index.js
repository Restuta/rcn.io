import React from 'react'
import Component from 'react-pure-render/component'
import Calendar from './Calendar.jsx'

export default class Home extends Component {

  render() {
    return (
      <div>
        <Calendar name="NCNCA Calendar" year={2015}
          containerWidth={this.props.containerWidth}
          weekdaysSizes={[1, 1, 2, 2, 2, 3, 3]}/>
        <Calendar name="NCNCA Calendar" year={2015}
          containerWidth={this.props.containerWidth}
          weekdaysSizes={[1, 1, 1, 2, 2, 3, 4]}/>
        <Calendar name="NCNCA Calendar" year={2015}
          containerWidth={this.props.containerWidth}
          weekdaysSizes={[2, 2, 2, 2, 2, 2, 2]}/>
        <Calendar name="NCNCA Calendar" year={2015}
            containerWidth={this.props.containerWidth}
            weekdaysSizes={[1, 1, 1, 2, 3, 3, 3]}/>
      </div>
    )
  }
}
