import React from 'react'
import Component from 'react-pure-render/component'
import classNames from 'classnames'

export default class Row extends Component {
  render() {
    const className = classNames('row', this.props.className)

    return (
      <div style={this.props.style} className={className}>
        {this.props.children }
      </div>
    )
  }
}
