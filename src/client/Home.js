import React from 'react'
import Component from 'react-pure-render/component'
import Auth0Badge from 'home/Auth0Badge.jsx'
import HeapAnalyticsBadge from 'home/HeapAnalyticsBadge.jsx'
import SheetsuBadge from 'home/SheetsuBadge.jsx'
import { Link } from 'react-router'
import 'home/Home.scss'
import Badge from 'calendar/badges/Badge.jsx'
import Colors from 'styles/colors'
import moment from 'moment'

const WhatIsNextItem = ({date, children, done}) => (
  <div className="WhatIsNextItem">
    <h3>
      {done
        ?
        (<Badge square heightRem={3} borderColor={Colors.body} color={Colors.body} bgColor='white'
          style={{marginRight: '1rem'}}>
          DONE
        </Badge>)
        : <Badge square heightRem={3} bgColor={Colors.primary} style={{marginRight: '1rem'}}>PLANNED</Badge>
      }
      {done
        ? <span className="italic w-300 text-3" style={{color: Colors.grey600}}>planned {date}</span>
        : (<span className="italic w-300 text-3">{date}</span>)
      }
    </h3>
    {done
      ? <p className="text-3 striked secondary">{children}</p>
      : <p className="text-3">{children}</p>
    }
  </div>
)


export default class Home extends Component {
  render() {
    return (
      <div className="Home">
        <section className="section-main">
          <h1 className="header-regular">RCN.io</h1>
          <p className="text-5 header-regular w-300">
            Calendars for bike racers.
          </p>
          <p className="text-5 header-regular w-300 margin top-4">
            Check out:&nbsp;
          </p>
          <ul className="text-4 cal-list">
            <li><Link to={'/calendars/usac-2017?past=visible'}>2017 USAC Calendar</Link></li>
            <li><Link to={'/calendars/ncnca-2017?past=visible'}>2017 NCNCA Calendar</Link></li>
            <li><Link to={'/calendars/ncnca-2016?past=visible'}>2016 NCNCA Calendar</Link></li>
            <li><Link to={'/calendars/norcal-mtb?past=visible'}>2016 NorCal MTB Calendar</Link></li>
          </ul>
        </section>

        <section className="section-next">
          <h2 className="header-whats-next header-regular uppercase w-900">What is coming next?</h2>
          <WhatIsNextItem date={moment('20 Sep 2016', 'DD MMM YYYY').fromNow()}>Filters! Allowing to filter by Discipline, Event Type
            and more, all at the same time. Mix and match!
          </WhatIsNextItem>
          <WhatIsNextItem done date={moment('1 Jul 2016', 'DD MMM YYYY').fromNow()}>
            We are working on full NCNCA Calendar that would include official USAC events,
            not only MTB, but also Road, Track and CX. Next we will focus on event details page that would include Map,
            Flyer, Start Times and other useful info.
          </WhatIsNextItem>
        </section>

        <section className="section-badges">
          <Auth0Badge className="badge" />
          <HeapAnalyticsBadge className="badge"/>
          <SheetsuBadge className="badge" />
        </section>
      </div>
    )
  }
}
