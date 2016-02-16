import React from 'react'
import Component from 'react-pure-render/component'
import WeekExample from '../temp/WeekExample.jsx'
import Calendar from './Calendar.jsx'

export default class Home extends Component {

  render() {
    const debug = false

    return (
      <div>
        <Calendar/>

        <WeekExample days={[2, 2, 2, 2, 2, 2, 2]} showDebugInfo={debug}/>
        <WeekExample days={[2, 2, 2, 2, 2, 2, 2]} showDebugInfo={debug}/>
        <WeekExample days={[2, 2, 2, 2, 2, 2, 2]} showDebugInfo={debug}/>
        <WeekExample days={[2, 2, 2, 2, 2, 2, 2]} showDebugInfo={debug}/>

        <WeekExample days={[2, 2, 2, 2, 2, 2, 2]} showDebugInfo={debug}/>
        <WeekExample days={[2, 2, 2, 2, 2, 2, 2]} showDebugInfo={debug}/>
        <WeekExample days={[2, 2, 2, 2, 2, 2, 2]} showDebugInfo={debug}/>
        <WeekExample days={[2, 2, 2, 2, 2, 2, 2]} showDebugInfo={debug}/>

        <WeekExample days={[2, 2, 2, 2, 2, 2, 2]} showDebugInfo={debug}/>
        <WeekExample days={[2, 2, 2, 2, 2, 2, 2]} showDebugInfo={debug}/>
        <WeekExample days={[2, 2, 2, 2, 2, 2, 2]} showDebugInfo={debug}/>
        <WeekExample days={[2, 2, 2, 2, 2, 2, 2]} showDebugInfo={debug}/>

        <WeekExample days={[2, 2, 2, 2, 2, 2, 2]} showDebugInfo={debug}/>
        <WeekExample days={[2, 2, 2, 2, 2, 2, 2]} showDebugInfo={debug}/>
        <WeekExample days={[2, 2, 2, 2, 2, 2, 2]} showDebugInfo={debug}/>
        <WeekExample days={[2, 2, 2, 2, 2, 2, 2]} showDebugInfo={debug}/>

        <WeekExample days={[1, 1, 1, 1, 2, 4, 4]} showDebugInfo={debug}/>
        <WeekExample days={[1, 1, 1, 1, 2, 4, 4]} showDebugInfo={debug}/>
        <WeekExample days={[1, 1, 1, 1, 2, 4, 4]} showDebugInfo={debug}/>
        <WeekExample days={[1, 1, 1, 1, 2, 4, 4]} showDebugInfo={debug}/>

        <WeekExample days={[1, 1, 1, 1, 2, 4, 4]} showDebugInfo={debug}/>
        <WeekExample days={[1, 1, 1, 1, 2, 4, 4]} showDebugInfo={debug}/>
        <WeekExample days={[1, 1, 1, 1, 2, 4, 4]} showDebugInfo={debug}/>
        <WeekExample days={[1, 1, 1, 1, 2, 4, 4]} showDebugInfo={debug}/>

        <WeekExample days={[1, 1, 1, 1, 2, 4, 4]} showDebugInfo={debug}/>
        <WeekExample days={[1, 1, 1, 1, 2, 4, 4]} showDebugInfo={debug}/>
        <WeekExample days={[1, 1, 1, 1, 2, 4, 4]} showDebugInfo={debug}/>
        <WeekExample days={[1, 1, 1, 1, 2, 4, 4]} showDebugInfo={debug}/>

        <WeekExample days={[1, 1, 1, 1, 2, 4, 4]} showDebugInfo={debug}/>
        <WeekExample days={[1, 1, 1, 1, 2, 4, 4]} showDebugInfo={debug}/>
        <WeekExample days={[1, 1, 1, 1, 2, 4, 4]} showDebugInfo={debug}/>
        <WeekExample days={[1, 1, 1, 1, 2, 4, 4]} showDebugInfo={debug}/>

      </div>
    )
  }
}
