import React from 'react'
import Component from 'react-pure-render/component'
import Auth0Badge from 'home/Auth0Badge.jsx'
import HeapAnalyticsBadge from 'home/HeapAnalyticsBadge.jsx'
import 'home/Home.scss'

export default class Home extends Component {
  render() {
    return (
      <div className="Home">
        <h1>Welcome Home ;) </h1>
        <Auth0Badge className="auth0-badge" />
        <HeapAnalyticsBadge className="heap-analytics-badge"/>
      </div>
    )
  }
}
