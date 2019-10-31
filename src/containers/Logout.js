import React from 'react'
import {connect} from 'react-redux'
import Router from 'next/router'
import { Creators as AuthActions } from '../redux/AuthRedux'

class Logout extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.submiting = false
  }

  onLogout () {
    this.submiting = true
    this.props.signout()
  }

  componentWillReceiveProps (nextProps) {
    const { logout } = nextProps
    const { isFetching, isFound, isFailure } = logout

    if (!isFetching && this.submiting) {
      this.submiting = false
      if (isFound) {
        this.props.resetAuth()
        Router.push('/login')
      }
      if (isFailure) {
        let notification = {
          message: logout.message,
          status: true,
          type: 'danger'
        }
        this.setState({ notification })
      }
    }
  }

  render () {
    return (
      <a onClick={() => this.onLogout()} href='#'><i className='far fa-share-square' /> Keluar</a>
    )
  }
}

const mapStateToProps = (state) => ({
  logout: state.logout
})

const mapDispatchToProps = (dispatch) => ({
  signout: (data) => dispatch(AuthActions.authLogoutRequest(data)),
  resetAuth: (data) => dispatch(AuthActions.resetAuth(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Logout)
