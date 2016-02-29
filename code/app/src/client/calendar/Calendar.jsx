import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './Calendar.scss'
import Day from './Day.jsx'
import Week from './Week.jsx'
import Event from './Event.jsx'
import WeekdaysHeader, {WeekdaysHeaderSticky} from './WeekdaysHeader.jsx'
import Sticky from 'react-sticky'
import Row from 'atoms/Row.jsx'
import Col from 'atoms/Col.jsx'


export default class Calendar extends Component {
  render() {
    const {name, year, containerWidth} = this.props

    return (
      <div className="Calendar">
        <h1>{name}</h1>

        <Sticky stickyContainerClass="Calendar" stickyStyle={{
          position: 'fixed',
          top: 0,
          left:0,
          right: 0,
          zIndex: 10000,
          // paddingTop: '1rem',
          marginTop: '7rem',
          paddingBottom: '0rem',
          //borderTop: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2)'
        }}>
          <Row>
            <Col xs={14} style={{
              marginLeft: 'auto',
              paddingLeft: '1rem',
              paddingRight: '1rem',
              marginRight: 'auto',
              maxWidth: containerWidth,
            }}>
              <WeekdaysHeader sizes={[2, 2, 2, 2, 2, 2, 2]}/>
            </Col>
          </Row>
        </Sticky>


        {/*<WeekdaysHeader sizes={[2, 2, 2, 2, 2, 2, 2]}/>*/}
        {/*<WeekdaysHeaderSticky sizes={[2, 2, 2, 2, 2, 2, 2]} containerWidth={containerWidth}/>*/}
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
