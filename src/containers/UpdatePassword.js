import React from 'react'
import {connect} from 'react-redux'
import Router from 'next/router'
import NotificationSystem from 'react-notification-system'
import MainContent from './MainContent2'
import Section from '../components/Section'
import { Creators as UserActions } from '../redux/UserRedux'

class UpdatePassword extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      newPassword: '',
      confirmPassword: '',
      notification: {
        message: '',
        position: 'tc',
        level: 'error'
      }
    }
    this.submiting = false
    this._notificationSystem = null
  }

  _addNotification () {
    if (this._notificationSystem) {
      this._notificationSystem.addNotification(this.state.notification)
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

  onSubmit () {
    const { newPassword, confirmPassword } = this.state
    let newPasswordValid = (newPassword.length > 5 && newPassword.length < 26)
    let confirmPasswordValid = (confirmPassword.length > 5 && confirmPassword.length < 26)
    let isPasswordEqual = (confirmPasswordValid ? confirmPassword === newPassword : true)
    let isAllValid = newPasswordValid && confirmPasswordValid && isPasswordEqual
    if (isAllValid) {
      this.submiting = true
      this.props.resetPassword({ newPassword })
    } else {
      this.setState({ validation: true })
    }
  }

  componentWillReceiveProps (nextProps) {
    const { reset } = nextProps
    const { isFetching, isFound, isFailure } = reset
    if (!isFetching && this.submiting) {
      this.submiting = false
      if (isFound) {
        let notification = {
          message: 'Berhasil Update Kata Sandi',
          position: 'tc',
          level: 'success'
        }
        this.setState({ notification }, () => {
          this._addNotification()
          setTimeout(() => {
            Router.push('/')
          }, 2000)
        })
      }
      if (isFailure) {
        let notification = {
          message: reset.message,
          position: 'tc',
          level: 'success'
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
                <p>Masukkan Kata Sandi baru Anda</p>
                <div className='form-log'>
                  <div className='form-group'>
                    <input className='input-bg password' name='newPassword' onChange={(e) => this.setState({ newPassword: e.target.value })} value={newPassword} type='password' placeholder='Kata sandi Anda' />
                    { this.renderValidation('newPassword', 'Mohon isi kata sandi Anda (6 - 25 karakter)') }
                  </div>
                  <div className='form-group'>
                    <input className='input-bg password' name='confirmPassword' onChange={(e) => this.setState({ confirmPassword: e.target.value })} value={confirmPassword} type='password' placeholder='Konfirmasi kata sandi Anda' />
                    { this.renderValidation('confirmPassword', 'Mohon isi konfirmasi kata sandi (6 - 25 karakter)') }
                    { this.renderValidation('passwordEqual', 'konfirmasi kata sandi Anda belum sama') }
                  </div>
                  <div className='form-group'>
                    <button className='btn btn-orange' onClick={() => this.onSubmit()}>Update Kata Sandi</button>
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
  reset: state.user
})

const mapDispatchToProps = (dispatch) => ({
  resetPassword: (data) => dispatch(UserActions.resetPasswordRequest(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePassword)
