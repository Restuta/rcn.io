import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './Checkbox.scss'

const Checkbox = (props) => {
  const classes = classNames('Checkbox c-input c-checkbox')

  return (
    <label className={classes}>
      <input type="checkbox" onChange={props.onChange} checked={props.checked}/>
      <span className="c-indicator"></span>
      {props.children}
    </label>
  )
}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
}


export default Checkbox
