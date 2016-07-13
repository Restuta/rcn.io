import React, { PropTypes } from 'react'
import Component from 'react-pure-render/component'
import './RaceTypeBadge.scss'


export default class RaceTypeBadge extends Component {
  render() {
    const { name, color, skew = 20 } = this.props
    const style = {
      transform: `skew(-${skew}deg)`,
      backgroundColor: color,
    }

    return (
      <span style={style} className='RaceTypeBadge'>
        <span style={{transform: `skew(${skew}deg)`}}>{name}</span>
      </span>
    )
  }
}

RaceTypeBadge.propTypes = {
  name: PropTypes.string.required,
  color: PropTypes.string.required,
  skew: PropTypes.number,
}
