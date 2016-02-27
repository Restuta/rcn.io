import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './Calendar.scss'
import Day from './Day.jsx'
import Week from './Week.jsx'
import Grid from 'styles/grid'
import Event from './Event.jsx'
import WeekdaysHeader from './WeekdaysHeader.jsx'

export default class Calendar extends Component {
  render() {
    const {name, year} = this.props

    return (
      <div className="Calendar">
        <h1>{name}</h1>

        <WeekdaysHeader sizes={[2, 2, 2, 2, 2, 2, 2]}/>
        <WeekdaysHeader sizes={[2, 2, 2, 2, 2, 2, 2]} style={{
          position: 'fixed',
          width: 1132,
          textAlign: 'center',
          top: 0,
          backgroundColor: 'white',
          zIndex: 9999,
          boxShadow: '0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.4)'
        }}/>
        <Week>
          <Day year={2016} month={1} day={1} size={2}>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
          </Day>
          <Day year={2016} month={1} day={2} size={2} />
          <Day year={2016} month={1} day={3} size={2} />
          <Day year={2016} month={1} day={4} size={2}>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
          </Day>
          <Day year={2016} month={1} day={5} size={2}>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
          </Day>
          <Day year={2016} month={1} day={6} size={2}>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
          </Day>
          <Day year={2016} month={1} day={7} size={2}>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
          </Day>
        </Week>

        <Week>
          <Day year={2016} month={1} day={8} size={2}>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
          </Day>
          <Day year={2016} month={1} day={9} size={2} />
          <Day year={2016} month={1} day={10} size={2}>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
          </Day>
          <Day year={2016} month={1} day={11} size={2}>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
          </Day>
          <Day year={2016} month={1} day={12} size={2}>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
          </Day>
          <Day year={2016} month={1} day={13} size={2}>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
          </Day>
          <Day year={2016} month={1} day={14} size={2}>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
          </Day>
        </Week>

        <Week>
          <Day year={2016} month={1} day={15} size={2}/>
          <Day year={2016} month={1} day={16} size={2}>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
          </Day>
          <Day year={2016} month={1} day={17} size={2}>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
          </Day>
          <Day year={2016} month={1} day={18} size={2}>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
          </Day>
          <Day year={2016} month={1} day={19} size={2}>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
          </Day>
          <Day year={2016} month={1} day={20} size={2}>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
          </Day>
          <Day year={2016} month={1} day={31} size={2}>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
          </Day>
        </Week>

        <Week>
          <Day year={2016} month={1} day={15} size={2}/>
          <Day year={2016} month={1} day={16} size={2}>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
          </Day>
          <Day year={2016} month={1} day={17} size={2}>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
          </Day>
          <Day year={2016} month={1} day={18} size={2}>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
          </Day>
          <Day year={2016} month={1} day={19} size={2}>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
          </Day>
          <Day year={2016} month={1} day={20} size={2}>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
          </Day>
          <Day year={2016} month={1} day={31} size={2}>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
          </Day>
        </Week>
      </div>
    )
  }
}

Calendar.propTypes = {
  year: PropTypes.number,
  name: PropTypes.string
}
