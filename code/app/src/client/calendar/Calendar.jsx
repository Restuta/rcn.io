import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './Calendar.scss'
import Day from './Day.jsx'
import Week from './Week.jsx'
import Event from './Event.jsx'
import WeekdaysHeader, {WeekdaysHeaderSticky} from './WeekdaysHeader.jsx'

export default class Calendar extends Component {
  render() {
    const {name, year, containerWidth} = this.props

    return (
      <div className="Calendar">
        <h1>{name}</h1>

        <WeekdaysHeader sizes={[2, 2, 2, 2, 2, 2, 2]}/>
        <div className="Calendar-body">
          <Week>
            <Day year={2016} month={1} day={1} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={2} size={2} />
            <Day year={2016} month={1} day={3} size={2} />
            <Day year={2016} month={1} day={4} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={5} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={6} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={7} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
          </Week>

          <Week>
            <Day year={2016} month={1} day={8} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={9} size={2} />
            <Day year={2016} month={1} day={10} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={11} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={12} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={13} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={14} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
          </Week>

          <Week>
            <Day year={2016} month={1} day={15} size={2}/>
            <Day year={2016} month={1} day={16} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={17} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={18} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={19} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={20} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={31} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
          </Week>

          <Week>
            <Day year={2016} month={1} day={15} size={2}/>
            <Day year={2016} month={1} day={16} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={17} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={18} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={19} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={20} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={31} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
          </Week>
        </div>
      </div>
    )
  }
}

Calendar.propTypes = {
  year: PropTypes.number,
  name: PropTypes.string
}
