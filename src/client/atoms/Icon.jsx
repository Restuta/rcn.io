import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import classNames from 'classnames'
import './Icon.scss'

export default class Icon extends Component {
  render() {
    const {name, color, size} = this.props
    const iconNameClass = 'material-icons'
    const style = {
      color: color,
      fontSize: `${size}rem`
    }

    const className = classNames('Icon', iconNameClass, this.props.className)
    return (
      <i {...this.props} className={className} style={style}>
        {name}
        {/*{this.props.children }*/}
      </i>
    )
  }
}

Icon.propTypes = {
  name: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.number //in rems
}
