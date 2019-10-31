import React, { Component } from 'react'
import getToken from '../services/GetToken'
import MPanelProfile from '../containers/MPanelProfile'
import PanelBeforeLogin from '../components/PanelBeforeLogin'

class SidebarWrapper extends Component {
  constructor (props) {
    super(props)
    this.state = {
      authed: ''
    }
  }

  componentDidMount () {
    let authed = getToken()
    this.setState({ authed })
  }

  render () {
    const { authed } = this.state
    return (
      <div className='sidebar-wrapper'>
        {
          authed
          ? <MPanelProfile />
          : <PanelBeforeLogin />
        }
      </div>
    )
  }
}

export default SidebarWrapper
