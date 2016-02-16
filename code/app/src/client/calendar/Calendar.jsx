import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './Calendar.scss'
import Month from './Month.jsx'

export default class Calendar extends Component {
  render() {
    const {name, year} = this.props

    return (
      <div className="Calendar">
        <h1>{name}</h1>

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
