import React from 'react'
import classNames from 'classnames'

export default class Row extends React.PureComponent {
  render() {
    const className = classNames('row', this.props.className)

    return (
      <div style={this.props.style} className={className}>
        {this.props.children }
      </div>
    )
  }
}
