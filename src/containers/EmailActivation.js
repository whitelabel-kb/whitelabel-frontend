import React from 'react'
import {connect} from 'react-redux'
import Router from 'next/router'
import Notification from '../components/Notification'
import MainContent from '../containers/MainContent2'
import Section from '../components/Section'
import { Creators as UserActions } from '../redux/UserRedux'
import Cookies from 'universal-cookie'
const cookies = new Cookies()

class EmailActivation extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      confirm: props.confirm,
      notification: {
        message: '',
        status: false,
        type: 'danger'
      }
    }
    this.submiting = false
  }

  componentDidMount () {
    const { token, uid } = this.props
    if (token && uid) {
      this.submiting = true
      this.props.userConfirm({ token, uid })
    } else {
      this.setState({ notification: { type: 'danger', message: 'Konfirmasi Email Gagal', status: true } })
    }
  }

  componentWillReceiveProps (nextProps) {
    const { confirm } = nextProps
    const { isFetching, isFound, isFailure } = confirm
    if (!isFetching && this.submiting) {
      this.submiting = false
      if (isFound) {
        cookies.set('access_token', `${confirm.data.accessToken}`, { path: '/' })
        Router.push('/reset/password')
      }
      if (isFailure) {
        this.setState({ confirm })
        Router.push('/update/password')
      }
    }
  }

  render () {
    const { notification, confirm } = this.state
    return (
      <MainContent>
        <Section className='grey-wrapper-log'>
          {
            confirm.isFailure && <div className='log-form-wrap'>
              <Notification {...notification} />
              <div className='title-log'>
                <div className='activation-wrap'>
                  <p>Cek email Anda untuk aktivasi akun Anda</p>
                  <a className='btn btn-orange' onClick={() => Router.push('/')}>Kembali ke Halaman Depan</a>
                </div>
              </div>
            </div>
          }
        </Section>
      </MainContent>
    )
  }
}

const mapStateToProps = (state) => ({
  confirm: state.user
})

const mapDispatchToProps = (dispatch) => ({
  userConfirm: (data) => dispatch(UserActions.confirmRequest(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(EmailActivation)
