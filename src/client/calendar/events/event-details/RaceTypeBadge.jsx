import React, { PropTypes } from 'react'
import './RaceTypeBadge.scss'
import Colors from 'styles/colors'


export default class RaceTypeBadge extends React.PureComponent {
  render() {
    const { name, color = 'transparent', skew = 20, inverted = false } = this.props

    const normalStyle = {
      transform: `skew(-${skew}deg)`,
      backgroundColor: color,
      //tiny hack to push text up on mobile view so it's aligned with possible inverted badges
      //like PAST
      borderBottom: `1px solid ${color}`,
    }

    const invertedColor = (color === 'white' || color === '#FFFFFF') ? Colors.body : color

    const invertedStyle = {
      transform: `skew(-${skew}deg)`,
      backgroundColor: 'transparent',
      border: `1px solid ${invertedColor}`,
      borderTop: 'none',
      color: invertedColor
    }

    const  style = inverted ? invertedStyle : normalStyle

    return (
      <span style={style} className='RaceTypeBadge fix-fout'>
        <span style={{transform: `skew(${skew}deg)`}}>{name}</span>
      </span>
    )
  }
}

RaceTypeBadge.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string,
  skew: PropTypes.number,
  inverted: PropTypes.bool,
}
