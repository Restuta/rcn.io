import React from 'react'


const EventCode = ({id, code}) => (
  <pre id={id} style={{
    boxShadow: '0 5px 31px 0 rgba(0, 0, 0, 0.13)',
    borderRadius: '0.375rem',
    padding: '2rem',
  }}>
    {code + ', '}
  </pre>
)

export default EventCode
