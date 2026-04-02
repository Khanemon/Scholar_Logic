import React from 'react'
import {Helmet} from 'react-helmet'
import PageTitle from '../components/PageTitle'
const Error = () => {
  return (
    <div>
      {/* <Helmet><title>Error</title></Helmet> */}
      <PageTitle title="Error"/>
      <h1>404 not found</h1>
    </div>
  )
}

export default Error
