import React, { PropTypes } from 'react'
import Component from 'react-pure-render/component'
import './Spinner.scss'
import Colors from 'styles/colors'
import classnames from 'classnames'

export default class Spinner extends Component {
  render() {
    const {
      size = 3,
      color = Colors.body,
      inline = false,
      className,
    } = this.props

    const classNames = classnames('Spinner', className)
    const sizeRem = size + 'rem'

    const style = {
      width: '100%',
      display: inline ? 'inline' : 'block',
    }

    const bounceStyle = {
      width: sizeRem,
      height: sizeRem,
      backgroundColor: color,
    }

    return (
      <div className={classNames} style={style}>
        <div className="bounce1" style={bounceStyle}></div>
        <div className="bounce2" style={bounceStyle}></div>
        <div className="bounce3" style={bounceStyle}></div>
      </div>
    )
  }
}

Spinner.propTypes = {
  //width in rems
  size: PropTypes.number,
  color: PropTypes.string,
  inline: PropTypes.bool,
}
