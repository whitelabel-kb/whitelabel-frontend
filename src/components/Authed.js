import React from 'react'
import Router from 'next/router'
import getToken from '../services/GetToken'

class Authed extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      authed: ''
    }
  }

  componentDidMount () {
    let authed = getToken()
    this.setState({ authed })
    if (authed) {
      Router.back()
    } else {
      Router.push('/login')
    }
  }

  render () {
    return (
      <br />
    )
  }
}

export default Authed
