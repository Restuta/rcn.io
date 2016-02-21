import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './Calendar.scss'
// import Row from ' atoms/Row.jsx'
// import Col from 'atoms/Col.jsx'
import Month from './Month.jsx'
import {Day, Week} from './Day.jsx'
import Grid from 'styles/grid'
import Event from './Event.jsx'

export default class Calendar extends Component {
  render() {
    const {name, year} = this.props

    return (
      <div className="Calendar">
        <h1>{name}</h1>

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
          <Day year={2016} month={1} day={21} size={2}>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
            <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
          </Day>
        </Week>

        <Month month={1} year={year} />
        <Month month={2} year={year} />
        <Month month={3} year={year} />
        <Month month={4} year={year} />
        <Month month={5} year={year} />
        <Month month={6} year={year} />
        <Month month={7} year={year} />
        <Month month={8} year={year} />
        <Month month={9} year={year} />
        <Month month={10} year={year} />
        <Month month={11} year={year} />
        <Month month={12} year={year} />
      </div>
    )
  }
}

Calendar.propTypes = {
  year: PropTypes.number,
  name: PropTypes.string
}
