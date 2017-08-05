import React from 'react'
import { getShorterUrl } from 'utils/url-utils'
import Icon from 'atoms/Icon.jsx'
import Colors from 'styles/colors'

const EventWebsite = ({url}) => {
  let eventComp

  if (url) {
    eventComp = (
      <a href={url} target="_blank">
        <Icon name="public" className="margin rgt-05" size={2} top={-1} color={Colors.primary}/>
        {getShorterUrl(url)}
      </a>
    )
  } else {
    eventComp = (<div>
      <Icon name="public" className="margin rgt-05" size={2} top={-1} color={Colors.grey500}/>
      {'--'}
    </div>
    )
  }

  return (
    <div>
      <h4 className="header-regular header-4">Event Website</h4>
      <div className="events-website-link text-3">
        {eventComp}
      </div>
    </div>
  )
}

export default EventWebsite
