In the store
 - hash of events by id (built in O(n))
 - or events array built in O(1) (since it's how it is in DB)


Calendar 
    - get events by date in O(1)
    - get total number of events after date in O(n)
        - this is done with Map() key is date, value is array of events

Event Details
    - get event by id in O(1)
      - can be done with another map of events by id


// const nameComponent = (
    //   <h1 className="title">
    //     {name} <span>{year}</span>
    //   </h1>
    // )