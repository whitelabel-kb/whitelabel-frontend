import React from 'react'
import {connect} from 'react-redux'
import NotificationSystem from 'react-notification-system'
import MainContent from './MainContent2'
import Section from '../components/Section'
import PanelProfile from './PanelProfile'
import { Creators as UserActions } from '../redux/UserRedux'
import { Creators as uiActions } from '../redux/ui'

class UpdatePassword extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      oldPassword: '',
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
    const { oldPassword, newPassword, confirmPassword, validation } = this.state
    let oldPasswordValid = type === 'oldPassword' && (oldPassword.length > 5 && oldPassword.length < 26)
    let newPasswordValid = type === 'newPassword' && (newPassword.length > 5 && newPassword.length < 26)
    let confirmPasswordValid = type === 'confirmPassword' && (confirmPassword.length > 5 && confirmPassword.length < 26)
    let isPasswordEqual = type === 'passwordEqual' && ((confirmPassword.length > 5 && confirmPassword.length < 26) ? confirmPassword === newPassword : true)
    let result = oldPasswordValid || newPasswordValid || confirmPasswordValid || isPasswordEqual
    return (
      validation && !result && <span className='text-alert-red'>{textFailed}</span>
    )
  }

  onSubmit () {
    const { oldPassword, newPassword, confirmPassword } = this.state
    let oldPasswordValid = oldPassword.length > 5 && oldPassword.length < 26
    let newPasswordValid = newPassword.length > 5 && newPassword.length < 26
    let confirmPasswordValid = confirmPassword.length > 5 && confirmPassword.length < 26
    let isPasswordEqual = (confirmPasswordValid ? confirmPassword === newPassword : true)
    let isAllValid = oldPasswordValid && newPasswordValid && confirmPasswordValid && isPasswordEqual
    if (isAllValid) {
      this.submiting = true
      this.props.changePassword({ oldPassword, newPassword })
    } else {
      this.setState({ validation: true })
    }
  }

  componentDidMount () {
    this.props.toogleRequest({ toogle: false })
  }

  componentWillReceiveProps (nextProps) {
    const { passwordChange } = nextProps
    const { isFetching, isFound, isFailure } = passwordChange

    if (!isFetching && this.submiting) {
      this.submiting = false
      if (isFound) {
        let notification = {
          message: 'Berhasil Edit Kata Sandi',
          position: 'tc',
          level: 'success'
        }
        this.setState({ notification }, () => {
          this._addNotification()
        })
      }
      if (isFailure) {
        let notification = {
          message: 'Kata sandi lama Anda salah',
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
    const { oldPassword, newPassword, confirmPassword } = this.state
    return (
      <MainContent>
        <NotificationSystem ref={n => (this._notificationSystem = n)} />
        <Section className='grey-wrapper'>
          <div className='container'>
            <div className='dashboard-wrap'>
              { <PanelProfile active='updatePassword' /> }
              <div className='panel-table'>
                <div className='title-dashboard'>
                  <h1>Edit Kata Sandi</h1>
                </div>
                <div className='edit-wrapper'>
                  <div className='form-edit-wrapper'>
                    <label htmlFor='lama'>Kata Sandi Lama</label>
                    <div className='form-edit'>
                      <input className='form-control' name='oldPassword' onChange={(e) => this.setState({ oldPassword: e.target.value })} value={oldPassword} type='password' placeholder='Kata sandi lama Anda' />
                      { this.renderValidation('oldPassword', 'Mohon isi kata sandi lama Anda (6 - 25 karakter)') }
                    </div>
                  </div>
                  <div className='form-edit-wrapper'>
                    <label htmlFor='baru'>Kata Sandi Baru</label>
                    <div className='form-edit'>
                      <input className='form-control' name='newPassword' onChange={(e) => this.setState({ newPassword: e.target.value })} value={newPassword} type='password' placeholder='Kata sandi baru Anda' />
                      { this.renderValidation('newPassword', 'Mohon isi kata sandi baru Anda (6 - 25 karakter)') }
                    </div>
                  </div>
                  <div className='form-edit-wrapper'>
                    <label htmlFor='confirm'>Konfirmasi Kata Sandi</label>
                    <div className='form-edit'>
                      <input className='form-control' name='confirmPassword' onChange={(e) => this.setState({ confirmPassword: e.target.value })} value={confirmPassword} type='password' placeholder='Konfirmasi kata sandi baru Anda' />
                      { this.renderValidation('confirmPassword', 'Mohon isi konfirmasi kata sandi (6 - 25 karakter)') }
                      { this.renderValidation('passwordEqual', 'konfirmasi kata sandi Anda belum sama') }
                    </div>
                  </div>
                  <div className='form-edit-wrapper'>
                    <label />
                    <div className='form-edit'>
                      <button className='btn btn-orange' onClick={() => this.onSubmit()}>Edit Kata Sandi</button>
                    </div>
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
  passwordChange: state.changePassword
})

const mapDispatchToProps = (dispatch) => ({
  changePassword: (data) => dispatch(UserActions.changePasswordRequest(data)),
  toogleRequest: (data) => dispatch(uiActions.toogleRequest(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePassword)
