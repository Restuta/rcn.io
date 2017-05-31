import React from 'react'
import UsacLogo from 'atoms/UsacLogo.jsx'

const UsacPermit = ({number}) => (
  <span className="nowrap secondary">
    <UsacLogo size={1} style={{marginRight: '1rem'}}/>
    <span className="text-sm-11 top-0">PERMIT {number}</span>
  </span>
)

export default UsacPermit
