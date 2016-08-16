import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './IconLabel.scss'
import Icon from 'atoms/Icon.jsx'
import Sizes from './card-sizes'
import classnames from 'classnames'


export default class IconLabel extends Component {
  render() {
    const { icon, size, className, style } = this.props
    const classNames = classnames(`IconLabel size-${size} fix-fout`, className)

    return (
      <div style={style} className={classNames}>
        <Icon name={icon} className="icon"/>
        <span className="text">{this.props.children}</span>
      </div>
    )
  }
}

IconLabel.propTypes = {
  size: PropTypes.oneOf(Object.keys(Sizes)).isRequired,
  icon: PropTypes.string.isRequired,
}
