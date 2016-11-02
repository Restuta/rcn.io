import React from 'react'
import Component from 'react-pure-render/component'
import classnames from 'classnames'
//import './HeapAnalyticsBadge.scss'

export default class HeapAnalyticsBadge extends Component {
  render() {
    const classNames = classnames('HeapAnalyticsBadge', this.props.className)

    return (
      <div className={classNames}>
        <a href="https://heapanalytics.com/?utm_source=badge">
          <img style={{width:'108px', height: '41px'}} src="//heapanalytics.com/img/badgeLight.png"
          alt="Heap | Mobile and Web Analytics" />
        </a>
      </div>
    )
  }
}
