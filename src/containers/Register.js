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
import { Creators as UserActions } from '../redux/UserRedux'
import { Creators as AuthActions } from '../redux/AuthSocial'
import { Creators as uiActions } from '../redux/ui'
// validation
import { isEmail } from '../helpers/input'

class Register extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      register: '',
      form: {
        name: '',
        email: ''
      },
      validation: false,
      notification: {
        message: '',
        position: 'tc',
        level: 'error'
      }
    }
    this.submiting = { register: false, userAuthFB: false, userAuthGoogle: false }
    this._notificationSystem = null
  }

  _addNotification () {
    if (this._notificationSystem) {
      this._notificationSystem.addNotification(this.state.notification)
    }
  }

  renderValidation (type, textFailed) {
    const { form, validation } = this.state
    let nameValid = type === 'name' && form.name.length > 0
    let emailValid = type === 'email' && form.email.length > 0
    let isEmailValid = type === 'isEmail' && (form.email.length > 0 ? isEmail(form.email) : true)
    let result = nameValid || emailValid || isEmailValid
    return (
      validation && !result && <span className='text-alert-red'>{textFailed}</span>
    )
  }

  handleInput (e) {
    const { name, value } = e.target
    const { form } = this.state
    form[name] = value
    this.setState({ form })
  }

  onRegister (e) {
    const { form } = this.state
    let nameValid = form.name.length > 0
    let emailValid = form.email.length > 0
    let isEmailValid = (form.email.length > 0 ? isEmail(form.email) : true)
    let isAllValid = nameValid && emailValid && isEmailValid
    if (e === 'Click' || e.key === 'Enter') {
      if (isAllValid) {
        this.submiting = { ...this.submiting, register: true }
        this.props.userRegister({ ...form })
      } else {
        this.setState({ validation: true })
      }
    }
  }

  responseFacebook (response) {
    if (response) {
      const { accessToken, email } = response
      this.submitingFb = true
      let notification = {
        message: 'Success',
        position: 'tc',
        level: 'success'
      }
      if (accessToken && email) {
        this.setState({ notification }, () => {
          this._addNotification()
        })
        this.submiting = { ...this.submiting, userAuthFB: true }
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

  responseGooglePlus (res) {
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
      this.submiting = { ...this.submiting, userAuthGoogle: true }
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
    this.props.toogleRequest({ toogle: false })
  }

  componentWillReceiveProps (nextProps) {
    const { register, authFacebook, authGoogle } = nextProps
    const { isFetching, isFound, isFailure } = register

    if (!isFetching && this.submiting.register) {
      this.submiting = { ...this.submiting, register: false }
      if (isFound) {
        this.setState({ register })
      }
      if (isFailure) {
        let message
        Object.keys(register.details).forEach((val) => {
          message = register.details[val]
        })
        message = [ ...new Set(message.toLowerCase().split(' ')) ].join(' ')
        let notification = {
          message,
          position: 'tc',
          level: 'error'
        }
        this.setState({ register: '', notification }, () => {
          this._addNotification()
        })
      }
    }

    if (!authFacebook.isFetching && this.submiting.userAuthFB) {
      this.submiting = { ...this.submiting, userAuthFB: false }
      if (authFacebook.isFound) {
        Router.push('/profile')
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

    if (!authGoogle.isFetching && this.submiting.userAuthGoogle) {
      this.submiting = { ...this.submiting, userAuthGoogle: false }
      if (authGoogle.isFound) {
        Router.push('/profile')
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
  }

  render () {
    const { form, register } = this.state
    return (
      <MainContent>
        <NotificationSystem ref={n => (this._notificationSystem = n)} />
        <Section className='grey-wrapper-log'>
          {
            register.data && register.data.id
            ? <RegisterSuccess />
            : <RegisterForm form={form}
              handleInput={(e) => this.handleInput(e)}
              renderValidation={(type, text) => this.renderValidation(type, text)}
              onRegister={(e) => this.onRegister(e)}
              responseFacebook={(res) => this.responseFacebook(res)}
              responseGooglePlus={(res) => this.responseGooglePlus(res)} />
          }
        </Section>
      </MainContent>
    )
  }
}

const RegisterSuccess = () => (
  <div className='log-form-wrap'>
    <div className='title-log'>
      <div className='activation-wrap'>
        <h2>Satu langkah lagi!</h2>
        <p>Cek email Anda untuk aktivasi akun Anda</p>
        <a className='btn btn-orange' onClick={() => Router.push('/')}>Kembali ke Halaman Depan</a>
      </div>
    </div>
  </div>
)

const RegisterForm = ({ form, handleInput, renderValidation, onRegister, responseFacebook, responseGooglePlus }) => {
  return (
    <div className='log-form-wrap'>
      <div className='title-log'>
        <h1>Hi, Donatur!</h1>
        <p>Silakan masukkan Nama dan Email anda</p>
      </div>
      <div className='form-log'>
        <div className='form-group'>
          <input onChange={(e) => handleInput(e)} name='name' value={form.name} className='input-bg user' type='text' placeholder='Masukkan Nama Anda' />
          { renderValidation('name', 'Mohon isi nama Anda') }
        </div>
        <div className='form-group'>
          <input onChange={(e) => handleInput(e)} onKeyPress={(e) => onRegister(e)} name='email' value={form.email} className='input-bg mail' type='email' placeholder='Masukkan Email Anda' />
          { renderValidation('email', 'Mohon isi alamat email Anda') }
          { renderValidation('isEmail', 'Alamat email tidak valid') }
        </div>
        <div className='form-group'>
          <button className='btn btn-orange' onClick={() => onRegister('Click')}>Daftar</button>
        </div>
        <p>Sudah punya akun? <Link href='/login'><a className='text-cyan'>Masuk disini</a></Link></p>

        <div className='social-log'>
          <div className='social-sparator'>
            <p>atau</p>
            <div className='sparator-wrap'>
              <div className='sparator-thin-left' />
              <div className='sparator-thin-right' />
            </div>
          </div>
          <Facebook
            text=' Daftar dengan Facebook'
            className='facebook-style'
            icon='fab fa-facebook-f register'
            responseFacebook={(response) => responseFacebook(response)} />
          <Google
            text=' Daftar dengan Google'
            className='google-style'
            icon='fab fa-google-plus-g register'
            onSuccess={(response) => responseGooglePlus(response)}
            onFailure={(response) => responseGooglePlus(response)}
          />
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  register: state.user,
  authFacebook: state.authFacebook,
  authGoogle: state.authGoogle
})

const mapDispatchToProps = (dispatch) => ({
  userRegister: (data) => dispatch(UserActions.registerRequest(data)),
  userAuthFB: (data) => dispatch(AuthActions.authFbRequest(data)),
  userAuthGoogle: (data) => dispatch(AuthActions.authGoogleRequest(data)),
  toogleRequest: (data) => dispatch(uiActions.toogleRequest(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Register)
