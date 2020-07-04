import React from 'react'

export const Spinner = ({active}) =>
  <div className={`spinner${active ? ' active' : ''}`}>
    <div uk-spinner="ratio: 3"/>
  </div>

export default Spinner
