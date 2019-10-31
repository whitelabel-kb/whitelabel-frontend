import React from 'react'
import {connect} from 'react-redux'
import Router from 'next/router'
import NotificationSystem from 'react-notification-system'
import MainContent from '../containers/MainContent2'
import Section from '../components/Section'
import { Creators as AuthActions } from '../redux/AuthRedux'

class ForgotPassword extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      newPassword: '',
      confirmPassword: '',
      token: '',
      uid: '',
      notification: {
        message: '',
        position: 'tc',
        level: 'error'
      }
    }
    this._notificationSystem = null
    this.submiting = false
  }

  _addNotification () {
    if (this._notificationSystem) {
      this._notificationSystem.addNotification(this.state.notification)
    }
  }

  componentDidMount () {
    const { token, uid } = this.props
    if (token && uid) {
      this.setState({ token, uid })
    } else {
      let notification = {
        message: 'Update kata sandi Gagal',
        position: 'tc',
        level: 'error'
      }
      this.setState({ notification }, () => {
        this._addNotification()
      })
    }
  }

  renderValidation (type, textFailed) {
    const { newPassword, confirmPassword, validation } = this.state
    let newPasswordValid = type === 'newPassword' && (newPassword.length > 5 && newPassword.length < 26)
    let confirmPasswordValid = type === 'confirmPassword' && (confirmPassword.length > 5 && confirmPassword.length < 26)
    let isPasswordEqual = type === 'passwordEqual' && ((confirmPassword.length > 5 && confirmPassword.length < 26) ? confirmPassword === newPassword : true)
    let result = newPasswordValid || confirmPasswordValid || isPasswordEqual
    return (
      validation && !result && <span className='text-alert-red'>{textFailed}</span>
    )
  }

  onSubmit (e) {
    const { token, uid, newPassword, confirmPassword } = this.state
    let newPasswordValid = (newPassword.length > 5 && newPassword.length < 26)
    let confirmPasswordValid = (confirmPassword.length > 5 && confirmPassword.length < 26)
    let isPasswordEqual = (confirmPasswordValid ? confirmPassword === newPassword : true)
    let isAllValid = newPasswordValid && confirmPasswordValid && isPasswordEqual
    if (e === 'Click' || e.key === 'Enter') {
      if (isAllValid) {
        this.submiting = true
        this.props.forgotPassword({ newPassword, token, uid })
      } else {
        this.setState({ validation: true })
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    const { forgot } = nextProps
    const { isFetching, isFound, isFailure } = forgot
    if (!isFetching && this.submiting) {
      this.submiting = false
      if (isFound) {
        let notification = {
          message: 'Silahkan masuk dengan kata sandi baru Anda',
          position: 'tc',
          level: 'success'
        }
        this.setState({ notification }, () => {
          this._addNotification()
        })
        Router.push('/login')
      }
      if (isFailure) {
        let notification = {
          message: 'Update kata sandi Gagal',
          position: 'tc',
          level: 'error'
        }
        this.setState({ notification }, () => {
          this._addNotification()
        })
      }
    }
  }

  render () {
    const { newPassword, confirmPassword } = this.state
    return (
      <MainContent>
        <Section className='grey-wrapper-log'>
          <NotificationSystem ref={n => (this._notificationSystem = n)} />
          <div className='log-form-wrap'>
            <div className='title-log'>
              <div className='activation-wrap'>
                <h2>Buat Kata Sandi Baru</h2>
                <p>Masukkan Kata Sandi baru anda</p>
                <div className='form-log'>
                  <div className='form-group'>
                    <input className='input-bg password' name='newPassword' onChange={(e) => this.setState({ newPassword: e.target.value })} value={newPassword} type='password' placeholder='Kata sandi Anda' />
                    { this.renderValidation('newPassword', 'Mohon isi kata sandi Anda (6 - 25 karakter)') }
                  </div>
                  <div className='form-group'>
                    <input className='input-bg password' name='confirmPassword' onKeyPress={(e) => this.onSubmit(e)} onChange={(e) => this.setState({ confirmPassword: e.target.value })} value={confirmPassword} type='password' placeholder='Konfirmasi kata sandi Anda' />
                    { this.renderValidation('confirmPassword', 'Mohon isi konfirmasi kata sandi Anda (6 - 25 karakter)') }
                    { this.renderValidation('passwordEqual', 'konfirmasi kata sandi Anda belum sama') }
                  </div>
                  <div className='form-group'>
                    <button className='btn btn-orange' onClick={() => this.onSubmit('Click')}>Update Kata Sandi</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </MainContent>
    )
  }
}

const mapStateToProps = (state) => ({
  forgot: state.forgotPassword
})

const mapDispatchToProps = (dispatch) => ({
  forgotPassword: (data) => dispatch(AuthActions.forgotPasswordRequest(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)
