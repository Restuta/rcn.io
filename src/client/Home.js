import React from 'react'
import Component from 'react-pure-render/component'
import Auth0Badge from 'home/Auth0Badge.jsx'
import HeapAnalyticsBadge from 'home/HeapAnalyticsBadge.jsx'
import JacoAnalyticsBadge from 'home/JacoAnalyticsBadge.jsx'
import SheetsuBadge from 'home/SheetsuBadge.jsx'
import { Link } from 'react-router'
import 'home/Home.scss'

export default class Home extends Component {
  render() {
    return (
      <div className="Home">
        <section className="section-main">
          <h1 className="header-regular">RCN.io</h1>
          <h2 className="header-regular w-500">
            Home for all <Link to={'/calendars/norcal-mtb'}>MTB events</Link>, both USAC and non-USAC ones.
          </h2>
        </section>

        <section className="section-next">
          <h2 className="header-whats-next header-regular uppercase w-900">What is coming next?</h2>
          <p className="text-3">We are working on full NCNCA Calendar that would include official USAC events,
          not only MTB, but also Road, Track and CX.</p>
          <p className="text-3">Next we would focus on event details page that would include Map, Flyer, Start Times
          and other useful info.</p>
        </section>


        <section className="section-badges">
          <Auth0Badge className="badge" />
          <HeapAnalyticsBadge className="badge"/>
          <JacoAnalyticsBadge className="badge"/>
          <SheetsuBadge className="badge" />
        </section>
      </div>
    )
  }
}
