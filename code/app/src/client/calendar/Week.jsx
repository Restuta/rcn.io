import React from 'react'
import Component from 'react-pure-render/component'
import Row from 'atoms/Row.jsx'
import './Week.scss'

export default class Week extends Component {
  render() {

    return (
      <Row className="Week">
        {this.props.children}
      </Row>
    )
  }
}

Week.propTypes = {
  children: function(props, propName, componentName) {

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
