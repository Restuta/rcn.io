import React from 'react'

const PresentedBy = ({by}) => (
  <span className="text-2" style={{
    fontStyle: 'italic',
    position: 'relative',
    marginRight: '2rem',
    marginBottom: '2rem',
  }}>
    <span className="secondary">by {(by || '--')}</span>
  </span>
)


export default PresentedBy
