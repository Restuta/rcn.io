
import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import Row from 'atoms/Row.jsx'
import './Week.scss'
import classnames from 'classnames'
// import { Months } from './utils/date-utils.js'

export default class Week extends Component {
  render() {
    const {
      lastOne,
      containsFirstDayOfMonth,
      // month,
    } = this.props

    const classNames = classnames('Week', {
      ['last-one']: lastOne,
      ['contains-first-day-of-month'] : containsFirstDayOfMonth
    })

    // const monthLabelComp = (
    //   <h3 style={{
    //     margin: 0,
    //     textTransform: 'uppercase',
    //     position: 'absolute',
    //     top: '0',
    //     left: '2rem',
    //   }}>
    //     {Months[month - 1].full}
    //   </h3>
    // )

    return (
      <Row className={classNames}>
        {this.props.children}
        {/* {containsFirstDayOfMonth && monthLabelComp} */}
      </Row>
    )
  }
}

Week.propTypes = {
  lastOne: PropTypes.bool,
  containsFirstDayOfMonth: PropTypes.bool,
  month: PropTypes.number,
  children: (props, propName, componentName) => {

    const children = props[propName]

    // if (children.reduce((x, y) => x.props.size + y.props.size ) !== 14) {   return new Error('A Week must have exactly 14 sizes, duh!') }
    // Only accept a single child, of the appropriate type
    if (React.Children.count(children) !== 7) {
      return new Error('`' + componentName + '` should have 7 children of the type "Day", but only '
        + React.Children.count(children) + ' were provided')
    }

    const totalDaysSizes = children.reduce((x, y, index) => {
      if (index === 1) {
        return x.props.size + y.props.size
      } else {
        return x + y.props.size
      }
    })

    if (totalDaysSizes !== 14) {
      return new Error('Total size of all Days should be exactly 14 to fit 14 columns of the grid.'
        + `Provided sum was: ${totalDaysSizes}`)
    }

    return null
  }
}
