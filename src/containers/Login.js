import React from 'react'
import {connect} from 'react-redux'
import Router from 'next/router'
import Link from 'next/link'
import NotificationSystem from 'react-notification-system'
// Components
import MainContent from './MainContent2'
import Section from '../components/Section'
import Facebook from '../components/Facebook'
import Google from '../components/Google'
import { Creators as AuthActions } from '../redux/AuthRedux'
import { Creators as AuthSocialActions } from '../redux/AuthSocial'
import { Creators as UserActions } from '../redux/UserRedux'
import { Creators as uiActions } from '../redux/ui'
// validation
import { isEmail } from '../helpers/input'

class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLogin: true,
      forgot: props.forgot,
      email: '',
      password: '',
      validation: false,
      notification: {
        message: '',
        position: 'tc',
        level: 'error'
      }
    }
    this.action = { login: false, loginFb: false, loginGoogle: false, getUser: false, forgotPassword: false }
    this._notificationSystem = null
  }

  _addNotification () {
    if (this._notificationSystem) {
      this._notificationSystem.addNotification(this.state.notification)
    }
  }

  renderValidation (type, textFailed) {
    const { email, password, validation } = this.state
    let emailValid = type === 'email' && email.length > 0
    let isEmailValid = type === 'isEmail' && (email.length > 0 ? isEmail(email) : true)
    let passValid = type === 'password' && password.length > 0
    let result = emailValid || isEmailValid || passValid
    return (
      validation && !result && <span className='text-alert-red'>{textFailed}</span>
    )
  }

  onReset () {
    const { email } = this.state
    let emailValid = email.length > 0
    let isEmailValid = (email.length > 0 ? isEmail(email) : true)
    let isAllValid = emailValid && isEmailValid
    if (isAllValid) {
      this.action = { ...this.action, forgotPassword: true }
      this.props.forgotPassword({ email })
    } else {
      this.setState({ validation: true })
    }
  }

  onSubmit (e) {
    const { email, password } = this.state
    let emailValid = email.length > 0
    let isEmailValid = (email.length > 0 ? isEmail(email) : true)
    let passValid = password.length > 0
    let isAllValid = emailValid && isEmailValid && passValid
    if (e === 'Click' || e.key === 'Enter') {
      if (isAllValid) {
        this.action = { ...this.action, login: true }
        this.props.login({ email, password })
      } else {
        this.setState({ validation: true })
      }
    }
  }

  responseFacebook (response) {
    if (response) {
      const { accessToken, email } = response
      let notification = {
        message: 'Success',
        position: 'tc',
        level: 'success'
      }
      if (accessToken && email) {
        this.setState({ notification }, () => {
          this._addNotification()
        })
        this.action = { ...this.action, loginFb: true }
        this.props.userAuthFB({ accessToken, email })
      } else {
        notification['level'] = 'error'
        notification['message'] = 'Terjadi kesalahan pada akun facebook Anda'
        this.setState({ notification }, () => {
          this._addNotification()
        })
      }
    }
  }

  responseGoogleLogin (res) {
    const { accessToken, profileObj } = res
    let notification = {
      message: 'Success',
      position: 'tc',
      level: 'success'
    }
    if (accessToken && profileObj.email) {
      this.setState({ notification }, () => {
        this._addNotification()
      })
      this.action = { ...this.action, loginGoogle: true }
      this.props.userAuthGoogle({ accessToken, email: profileObj.email })
    } else {
      // notification['level'] = 'error'
      // notification['message'] = 'Terjadi kesalahan pada akun google Anda'
      // this.setState({ notification }, () => {
      //   this._addNotification()
      // })
      console.log('res', res)
    }
  }

  componentDidMount () {
    this.setState({ isLogin: true, forgot: { ...this.state.forgot, isFound: false } })
    this.props.toogleRequest({ toogle: false })
  }

  componentWillReceiveProps (nextProps) {
    const { auth, authFacebook, authGoogle, forgot, user } = nextProps
    const { isFetching, isFound, isFailure } = auth

    if (!isFetching && this.action.login) {
      this.action = { ...this.action, login: false }
      if (isFound) {
        this.action = { ...this.action, getUser: true }
        this.props.getUser()
      }
      if (isFailure) {
        let notification = {
          message: 'Email atau kata sandi yang Anda masukkan salah, Silahkan coba lagi',
          position: 'tc',
          level: 'error'
        }
        this.setState({ notification }, () => {
          this._addNotification()
        })
      }
    }

    if (!authFacebook.isFetching && this.action.loginFb) {
      this.action = { ...this.action, loginFb: false }
      if (authFacebook.isFound) {
        this.action = { ...this.action, getUser: true }
        this.props.getUser()
      }
      if (authFacebook.isFailure) {
        let notification = {
          message: authFacebook.message,
          position: 'tc',
          level: 'error'
        }
        this.setState({ notification }, () => {
          this._addNotification()
        })
      }
    }

    if (!authGoogle.isFetching && this.action.loginGoogle) {
      this.action = { ...this.action, loginGoogle: false }
      if (authGoogle.isFound) {
        this.action = { ...this.action, getUser: true }
        this.props.getUser()
      }
      if (authGoogle.isFailure) {
        let notification = {
          message: authGoogle.message,
          position: 'tc',
          level: 'error'
        }
        this.setState({ notification }, () => {
          this._addNotification()
        })
      }
    }

    if (!forgot.isFetching && this.action.forgotPassword) {
      this.action = { ...this.action, forgotPassword: false }
      if (forgot.isFound) {
        this.setState({ forgot })
      }
      if (forgot.isFailure) {
        let notification = {
          message: forgot.message,
          position: 'tc',
          level: 'error'
        }
        this.setState({ notification }, () => {
          this._addNotification()
        })
      }
    }

    if (!user.isFetching && this.action.getUser) {
      this.action = { ...this.action, getUser: false }
      if (user.isFound) {
        this.props.getMyDonations()
        Router.push('/')
      }
      if (user.isFailure) {
        let notification = {
          message: user.message,
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
    const { email, password, isLogin, forgot } = this.state
    return (
      <MainContent>
        <Section className='grey-wrapper-log'>
          <NotificationSystem ref={n => (this._notificationSystem = n)} />
          {
            isLogin
            ? <LoginForm
              email={email}
              password={password}
              renderValidation={(type, textFailed) => this.renderValidation(type, textFailed)}
              setEmail={(e) => this.setState({ email: e.target.value })}
              setPass={(e) => this.setState({ password: e.target.value })}
              onSubmit={(e) => this.onSubmit(e)}
              toForgotPassword={() => this.setState({ isLogin: false })}
              responseFacebook={(res) => this.responseFacebook(res)}
              responseGoogleLogin={(res) => this.responseGoogleLogin(res)}
              responseGoogleLogout={(res) => this.responseGoogleLogout(res)} />
            : forgot.isFound
              ? <ForgotPasswordSuccess />
              : <ForgotPassword
                email={email}
                renderValidation={(type, textFailed) => this.renderValidation(type, textFailed)}
                setEmail={(e) => this.setState({ email: e.target.value })}
                onReset={() => this.onReset()}
                />
          }
        </Section>
      </MainContent>
    )
  }
}

const ForgotPasswordSuccess = () => (
  <div className='log-form-wrap'>
    <div className='title-log'>
      <div className='activation-wrap'>
        <p>Cek email Anda untuk aktivasi akun Anda</p>
        <a className='btn btn-orange' onClick={() => Router.push('/')}>Kembali ke Halaman Depan</a>
      </div>
    </div>
  </div>
)

const ForgotPassword = ({ email, onReset, renderValidation, setEmail }) => (
  <div className='log-form-wrap'>
    <div className='title-log'>
      <h2>Lupa Kata Sandi</h2>
      <p>Masukkan Alamat email anda, kami akan</p>
      <p>mengirimkan link reset Kata Sandi di email anda</p>
    </div>
    <div className='form-log'>
      <div className='form-group'>
        <input onChange={(e) => setEmail(e)} name='email' value={email} className='input-bg mail' type='text' placeholder='Masukkan Email Anda' />
        { renderValidation('email', 'Mohon isi alamat email Anda') }
        { renderValidation('isEmail', 'Alamat email tidak valid') }
      </div>
      <div className='form-group'>
        <button className='btn btn-orange' onClick={() => onReset()}>Reset Kata Sandi</button>
      </div>
    </div>
  </div>
)

const LoginForm = ({ email, password, setEmail, setPass, onSubmit, renderValidation, toForgotPassword, responseFacebook, responseGoogleLogin, responseGoogleLogout }) => (
  <div className='log-form-wrap'>
    <div className='title-log'>
      <h1>Hi, Donatur!</h1>
      <p>Silakan masukkan Email dan Kata Sandi anda</p>
    </div>
    <div className='form-log'>
      <div className='form-group'>
        <input onChange={(e) => setEmail(e)} name='email' value={email} className='input-bg mail' type='text' placeholder='Masukkan Email Anda' />
        { renderValidation('email', 'Mohon isi alamat email Anda') }
        { renderValidation('isEmail', 'Alamat email tidak valid') }
      </div>
      <div className='form-group'>
        <input onChange={(e) => setPass(e)} onKeyPress={(e) => onSubmit(e)} name='password' value={password} className='input-bg password' type='password' placeholder='Masukkan Kata Sandi Anda' />
        { renderValidation('password', 'Mohon isi kata sandi Anda') }
      </div>
      <div className='form-group text-right' onClick={() => toForgotPassword()}><a href='#' className='text-cyan'>Lupa kata sandi?</a></div>
      <div className='form-group'>
        <button className='btn btn-orange' onClick={() => onSubmit('Click')}>Masuk</button>
      </div>
      <p>Belum punya akun? <Link href='/register'><a className='text-cyan'>Daftar disini</a></Link></p>
      <div className='social-log'>
        <div className='social-sparator'>
          <p>atau</p>
          <div className='sparator-wrap'>
            <div className='sparator-thin-left' />
            <div className='sparator-thin-right' />
          </div>
        </div>
        <Facebook
          text=' Masuk dengan Facebook'
          className='facebook-style'
          icon='fab fa-facebook-f login'
          responseFacebook={(response) => responseFacebook(response)} />
        <Google
          text=' Masuk dengan Google'
          className='google-style'
          icon='fab fa-google-plus-g login'
          onSuccess={(response) => responseGoogleLogin(response)}
          onFailure={(response) => responseGoogleLogin(response)}
        />
      </div>
    </div>
  </div>
)

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    authFacebook: state.authFacebook,
    authGoogle: state.authGoogle,
    forgot: state.forgotPassword,
    user: state.user
  }
}

const mapDispatchToProps = (dispatch) => ({
  login: (data) => dispatch(AuthActions.authRequest(data)),
  userAuthFB: (data) => dispatch(AuthSocialActions.authFbRequest(data)),
  userAuthGoogle: (data) => dispatch(AuthSocialActions.authGoogleRequest(data)),
  forgotPassword: (data) => dispatch(AuthActions.forgotRequest(data)),
  getUser: () => dispatch(UserActions.userRequest()),
  toogleRequest: (data) => dispatch(uiActions.toogleRequest(data)),
  getMyDonations: (data) => dispatch(UserActions.myDonationRequest(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
