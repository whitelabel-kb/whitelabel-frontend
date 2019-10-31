import React from 'react'
import {connect} from 'react-redux'
import Router from 'next/router'
import Notification from '../components/Notification'
import MainContent from './MainContent2'
import ReadAbleText from '../helpers/ReadAbleText'
// import Header from './Header'
import Section from '../components/Section'
import { Creators as UserActions } from '../redux/UserRedux'

class ResetPassword extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      newPassword: '',
      confirmPassword: '',
      notification: {
        message: '',
        status: false,
        type: 'danger'
      }
    }
    this.submiting = false
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
    let newPasswordValid = newPassword.length > 5 && newPassword.length < 26
    let confirmPasswordValid = confirmPassword.length > 5 && confirmPassword.length < 26
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
        Router.push('/profile')
      }
      if (isFailure) {
        let message
        Object.keys(reset.details.messages).forEach((val) => {
          reset.details.messages[val].forEach((v) => {
            message = v
          })
        })
        let notification = {
          message,
          status: true,
          type: 'danger'
        }
        this.setState({ notification })
      }
    }
  }

  render () {
    const { newPassword, confirmPassword, notification } = this.state
    const { reset, company } = this.props
    let userName = ''
    let companyName = ''
    if (!reset.isFetching && reset.isFound) {
      const { name } = reset.data
      userName = ReadAbleText(name)
    }
    if (company.isFound) {
      const { name } = company.data
      companyName = name
    }
    return (
      <MainContent>
        <Section className='grey-wrapper-log'>
          <Notification {...notification} />
          <div className='log-form-wrap'>
            <div className='title-log'>
              <div className='activation-wrap'>
                <h2>Satu langkah lagi!</h2>
                <p><strong>{userName}</strong>, tinggal selangkah lagi untuk memulai berkolaborasi di {ReadAbleText(companyName)}. Silakan atur kata sandi yang akan Anda gunakan untuk login.</p>
                <div className='form-log'>
                  <div className='form-group'>
                    <input className='input-bg password' name='newPassword' onChange={(e) => this.setState({ newPassword: e.target.value })} value={newPassword} type='password' placeholder='Kata sandi Anda' />
                    { this.renderValidation('newPassword', 'Mohon isi kata sandi Anda (6 - 25 karakter)') }
                  </div>
                  <div className='form-group'>
                    <input className='input-bg password' name='confirmPassword' onChange={(e) => this.setState({ confirmPassword: e.target.value })} value={confirmPassword} type='password' placeholder='Konfirmasi kata sandi Anda' />
                    { this.renderValidation('confirmPassword', 'Mohon isi konfirmasi kata sandi Anda (6 - 25 karakter)') }
                    { this.renderValidation('passwordEqual', 'konfirmasi kata sandi Anda belum sama') }
                  </div>
                  <div className='form-group'>
                    <button className='btn btn-orange' onClick={() => this.onSubmit()}>Daftar</button>
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
  company: state.company,
  reset: state.user
})

const mapDispatchToProps = (dispatch) => ({
  resetPassword: (data) => dispatch(UserActions.resetPasswordRequest(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)
