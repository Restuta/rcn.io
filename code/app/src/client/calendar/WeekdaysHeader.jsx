import React from 'react'
import Component from 'react-pure-render/component'
import Row from 'atoms/Row.jsx'
import Col from 'atoms/Col.jsx'
import moment from 'moment'

export default class WeekdaysHeader extends Component {
  render() {
    const {sizes} = this.props

    const colStyle = {
      //outline: `1px solid silver`,
      //borderTop: '1px solid silver',
      //borderLeft: '1px solid silver',
      //borderRight: '1px solid silver',
      minHeight: '4rem',
      paddingTop: '1rem',
      fontSize: '2rem',
      textAlign: 'right',
      //fontWeight: '300',
      textTransform: 'uppercase'

    }

    const columns = sizes.map((size, i) => {
      return (
        <Col key={i} xs={size} style={colStyle}>
          {moment.weekdaysShort()[i]}
        </Col>
      )
    })

    const style = null


    return (
      <div className="WeekDaysHeader" style={style} {...this.props}>
        {/*<Row>
          {columns}
        </Row>*/}
      </div>
    )
  }
}
