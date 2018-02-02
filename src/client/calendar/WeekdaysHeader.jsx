import React from 'react'
import Component from 'react-pure-render/component'
import Row from 'atoms/Row.jsx'
import Col from 'atoms/Col.jsx'
import Colors from 'styles/colors'
import { Weekdays } from './utils/date-utils'
import { pxToRem } from 'styles/typography'

const pxToRems = (px) => pxToRem(px) + 'rem'


export default class WeekdaysHeader extends Component {
  render() {
    const {sizes} = this.props

    const rowStyle = {
      flexWrap: 'nowrap'
    }

    const colStyle = {
      minHeight: '4rem',
      textAlign: 'right',
      // backgroundColor: Colors.bodyBg,
      //borderRight: '1px solid #e0e0e0',
      //marginRight: '-1px'
      //position: 'relative',
      //left: '1px',
    }

    const weekdaysNameStyleBase = {
      fontSize: '1.75rem',
      paddingTop: '1rem',
      position: 'relative',
      top: pxToRems(2),
      textTransform: 'uppercase',
      textAlign: 'right'
      //fontFamily: 'Oswald',
       //fontWeight: 700,
    }


    const columns = sizes.map((size, i) => {
      const weekdaysNameStyle = { ...weekdaysNameStyleBase }

      if (Weekdays[i].short.toLowerCase() === 'sat' || Weekdays[i].short.toLowerCase() === 'sun') {
        weekdaysNameStyle.color = Colors.primary
        weekdaysNameStyle.fontWeight = 900
      }

      const weekdayLabel = Weekdays[i].short[0] // first letter

      return (
        <Col key={i} xs={size} style={colStyle} className="WeekDaysHeader-day">
          <div style={weekdaysNameStyle} className="fix-fout">{weekdayLabel}</div>
        </Col>
      )
    })

    return (
      <div className="WeekDaysHeader">
        <Row style={rowStyle}>
          {columns}
        </Row>
      </div>
    )
  }
}

export class WeekdaysHeaderSticky extends Component {//eslint-disable-line
  render() {
    const { sizes, containerWidth } = this.props

    return (
      <div className="WeekDaysHeaderSticky" style={{
        position: 'fixed',
        top: '0rem',
        zIndex: 999,
        width: '100%',
        left: 0,
        //backgroundColor: Colors.bodyBg,
        boxShadow: '0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2)'
      }}>
        <WeekdaysHeader sizes={sizes} style={{
          width: containerWidth,
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          //left: '0',
          textAlign: 'center',
        }}/>
      </div>
    )
  }
}
