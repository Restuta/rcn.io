import React from 'react'
import Component from 'react-pure-render/component'
import WeekExample from '../temp/WeekExample.jsx'
import Calendar from './Calendar.jsx'

export default class Home extends Component {

  render() {
    const debug = false

    return (
      <div>
        <Calendar name="NCNCA Calendar" year={2016} containerWidth={this.props.containerWidth}/>
      </div>
    )
  }
}
