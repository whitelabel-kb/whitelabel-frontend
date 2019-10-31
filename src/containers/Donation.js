import React from 'react'
import {connect} from 'react-redux'
import moment from 'moment'
import {Router} from '../../routes'
import { animateScroll as scroll } from 'react-scroll'
// Components
import Facebook from '../components/Facebook'
import Google from '../components/Google'
import NotificationSystem from 'react-notification-system'
import MainContent from './MainContent2'
import Section from '../components/Section'
import Container from '../components/Container'
import { Images } from '../themes'
import RupiahFormat from '../helpers/RupiahFormat'
// import ReadAbleText from '../helpers/ReadAbleText'
import { inputNumber, isEmail, isPhoneValid, getNumber } from '../helpers/input'
import getToken from '../services/GetToken'
import { Creators as CampaignsActions } from '../redux/CampaignRedux'
import { Creators as UserActions } from '../redux/UserRedux'
import { Creators as BanksActions } from '../redux/Bank'
import { Creators as AuthSocialActions } from '../redux/AuthSocial'
moment.locale('id')

class Donation extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      authed: null,
      hostname: '',
      form: {
        name: '',
        email: '',
        phone: '',
        amount: '',
        anonymous: false,
        message: '',
        bank: ''
      },
      countMessage: 0,
      validation: false,
      notification: {
        message: '',
        position: 'tc',
        level: 'error'
      }
    }
    this._notificationSystem = null
    this.action = { getCampaignDetail: false, getUser: false, postCampaignDonation: false, listBanks: false, loginFb: false, loginGoogle: false }
  }

  _addNotification () {
    if (this._notificationSystem) {
      this._notificationSystem.addNotification(this.state.notification)
    }
  }

  componentDidMount () {
    let authed = getToken()
    const hostname = window.location.hostname
    this.setState({ authed, hostname })
    const { link, amount } = this.props
    if (link) {
      this.action = { ...this.action, getCampaignDetail: true }
      this.props.getCampaignDetail({ link })
    }
    if (amount) {
      this.setState({ form: { ...this.state.form, amount } })
    }
    if (!this.props.banks.isFound) {
      this.action = { ...this.action, listBanks: true }
      this.props.listBanks()
    }
    this.action = { ...this.action, getUser: true }
    this.props.getUser()
    let utmSource = this.props.url.query.utm_source
    let utmMedium = this.props.url.query.utm_medium
    let utmCampaign = this.props.url.query.utm_campaign
    if (utmSource && utmMedium && utmCampaign) {
      Router.pushRoute(`/${link}/donation`)
    }
    scroll.scrollToTop()
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
      notification['level'] = 'error'
      notification['message'] = 'Terjadi kesalahan pada akun google Anda'
      this.setState({ notification }, () => {
        this._addNotification()
      })
    }
  }

  renderValidation (type, textFailed) {
    const { form, validation, authed } = this.state
    let result = null
    let amout = Number(getNumber(form.amount))
    let amountValid = type === 'amount' && amout > 0
    let checkMount = ((amout % 1000) === 0) && (amout > 19999)
    let isMountValid = type === 'isAmount' && (amout > 0 ? checkMount : true)
    let isMaxMountValid = type === 'isMaxAmount' && ((amout > 0) && checkMount ? amout < 1000000001 : true)
    let messageValid = type === 'message' && form.message.length < 141
    let bankValid = type === 'bank' && (form.bank > 0)
    let phoneValid = type === 'phone' && form.phone.length > 0
    let isPhoneNumber = type === 'isPhone' && (form.phone.length > 0 ? isPhoneValid(form.phone) : true)
    result = amountValid || isMountValid || isMaxMountValid || messageValid || bankValid || phoneValid || isPhoneNumber
    if (!authed) {
      let nameValid = type === 'name' && form.name.length > 0
      let nameMinValid = type === 'isNameMin' && (form.name.length > 0 ? form.name.length >= 3 && form.name.length <= 30 : true)
      let emailValid = type === 'email' && form.email.length > 0
      let isEmailValid = type === 'isEmail' && (form.email.length > 0 ? isEmail(form.email) : true)
      result = nameValid || nameMinValid || emailValid || isEmailValid || phoneValid || isPhoneNumber || amountValid || isMountValid || isMaxMountValid || messageValid || bankValid
    }
    return (
      validation && !result && <span className='text-alert-red'>{textFailed}</span>
    )
  }

  handleInput (e) {
    const { name, value } = e.target
    const { form } = this.state
    if (name === 'amount' && value.length < 14) {
      let amount = inputNumber(value)
      form[name] = RupiahFormat(Number(amount))
    }
    if (name === 'phone' && value.length < 16) {
      form[name] = inputNumber(value)
    }
    if (name === 'anonymous') {
      form[name] = !form.anonymous
    }
    if (name === 'message') {
      if (Number(value.length) < 141) {
        form[name] = value
        this.setState({ countMessage: Number(value.length) })
      }
    }
    if (name === 'name' || name === 'email') {
      form[name] = value
    }
    this.setState({ form })
  }

  handleInputBank (bank) {
    this.setState({form: { ...this.state.form, bank }})
  }

  onSubmit () {
    const { form, authed } = this.state
    let amout = Number(getNumber(form.amount))
    let amountValid = amout > 0
    let checkMount = ((amout % 1000) === 0) && (amout > 19999)
    let isMountValid = (amountValid ? checkMount : true)
    let isMaxMountValid = (amountValid && checkMount ? amout < 1000000001 : true)
    let messageValid = form.message.length < 141
    let bankValid = (form.bank > 0)
    let phoneValid = form.phone.length > 0
    let isPhoneNumber = (form.phone.length > 0 ? isPhoneValid(form.phone) : true)
    let isValidLogged = amountValid && isMountValid && isMaxMountValid && messageValid && bankValid && phoneValid && isPhoneNumber
    let isValidNotLogin
    if (!phoneValid || !isPhoneNumber || !amountValid || !isMountValid || !isMaxMountValid) {
      scroll.scrollTo(180)
    }
    if (!authed) {
      let nameValid = form.name.length > 0
      let nameMinValid = (form.name.length > 0) ? (form.name.length >= 3 && form.name.length <= 30) : true
      let emailValid = form.email.length > 0
      let isEmailValid = (form.email.length > 0) ? isEmail(form.email) : true
      isValidNotLogin = nameValid && nameMinValid && emailValid && isEmailValid && phoneValid && isPhoneNumber && amountValid && isMountValid && isMaxMountValid && messageValid && bankValid
      if (!nameValid || !nameMinValid || !emailValid || !isEmailValid || !phoneValid || !isPhoneNumber || !amountValid || !isMountValid || !isMaxMountValid) {
        scroll.scrollTo(180)
      }
    }
    let isAllValid = !authed ? isValidNotLogin : isValidLogged
    if (isAllValid) {
      this.submiting = true
      let params = {}
      params['campaignId'] = this.props.campaign.data.id
      params['amount'] = amout
      params['message'] = form.message
      params['bank'] = form.bank
      params['name'] = form.name
      params['email'] = form.email
      params['phone'] = form.phone
      params['userId'] = form.userId
      if (form.anonymous) {
        params['anonymous'] = form.anonymous
      }
      this.action = { ...this.action, postCampaignDonation: true }
      if (authed) {
        this.props.postCampaignDonations(params)
      } else {
        this.props.postCampaignDonations2(params)
      }
    } else {
      this.setState({ validation: true })
    }
  }

  componentWillReceiveProps (nextProps) {
    const { campaign, user, postDonation, banks, authFacebook, authGoogle } = nextProps
    const { isFetching, isFailure } = campaign

    if (!authFacebook.isFetching && this.action.loginFb) {
      this.action = { ...this.action, loginFb: false }
      if (authFacebook.isFound) {
        Router.push('/authed')
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
        Router.push('/authed')
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

    if (!user.isFetching && this.action.getUser) {
      this.action = { ...this.action, getUser: false }
      if (user.isFound) {
        const { id, name, email, phone } = user.data
        let form = {
          userId: id,
          name,
          email,
          phone: !phone ? '' : phone
        }
        this.setState({ form: { ...this.state.form, ...form }, postDonation: { ...this.state.postDonation, isFound: false } })
      }
      if (user.isFailure) {
        let notification = {
          message: user.message,
          position: 'tc',
          level: 'error'
        }
        this.setState({ user, notification }, () => {
          this._addNotification()
        })
      }
    }

    if (!isFetching && this.action.getCampaignDetail) {
      this.action = { ...this.action, getCampaignDetail: false }
      if (isFailure) {
        let notification = {
          message: campaign.message,
          position: 'tc',
          level: 'error'
        }
        this.setState({ notification }, () => {
          this._addNotification()
        })
      }
    }

    if (!postDonation.isFetching && this.action.postCampaignDonation) {
      this.action = { ...this.action, postCampaignDonation: false }
      if (postDonation.isFound) {
        const { id } = postDonation.data
        Router.pushRoute(`/${this.props.link}/summary/${id}`)
      }
      if (postDonation.isFailure) {
        let notification = {
          message: postDonation.message,
          position: 'tc',
          level: 'error'
        }
        this.setState({ notification }, () => {
          this._addNotification()
        })
      }
    }

    if (!banks.isFetching && this.action.listBanks) {
      this.action = { ...this.action, listBanks: false }
      if (banks.isFailure) {
        let notification = {
          message: banks.message,
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
    const { authed, form, countMessage } = this.state
    const { user, campaign, banks } = this.props
    let myDonation = form.amount ? form.amount : '0'
    return (
      <MainContent>
        <Section className='grey-wrapper donasi'>
          <NotificationSystem ref={n => (this._notificationSystem = n)} />
          <Container>
            <div className='donate-trans-wrap'>
              <div className='text-center'>
                <h5>Kamu akan berdonasi untuk campaign</h5>
                <h3>{campaign.isFound && campaign.data.title}</h3>
              </div>
              <div className='flow-donate-wrap'>
                <div className='icon-flow-wrap'>
                  <div className='icon-flow-donate'><img src={Images.heart} alt='love' />
                    <p>Donasi</p>
                  </div>
                </div>
                <div className='icon-flow-wrap'>
                  <div className='icon-flow-donate'><img src={Images.cardGrey} alt='card' />
                    <p>Bayar</p>
                  </div>
                </div>
                <div className='sparator-vertical' />
              </div>
              <FormPostDonation
                authed={authed}
                form={form}
                user={user}
                handleInput={(e) => this.handleInput(e)}
                countMessage={countMessage}
                renderValidation={(name, textFailed) => this.renderValidation(name, textFailed)}
                banks={banks}
                handleInputBank={(e) => this.handleInputBank(e)}
                myDonation={myDonation}
                onSubmit={() => this.onSubmit()}
                responseFacebook={(res) => this.responseFacebook(res)}
                responseGoogleLogin={(res) => this.responseGoogleLogin(res)} />
            </div>
          </Container>
        </Section>
      </MainContent>
    )
  }
}

const FormPostDonation = ({ authed, user, form, countMessage, handleInput, renderValidation, banks, handleInputBank, myDonation, onSubmit, responseFacebook, responseGoogleLogin }) => (
  <div>
    <div className='form-wrap'>
      {
        !authed
        ? <div className='form-guest'>
          <h4>Masukkan identitas anda</h4>
          <div className='form-log'>
            <div className='form-group'>
              <input value={form.name} onChange={(e) => handleInput(e)} name='name' className='input-bg user' type='text' placeholder='Masukkan Nama Anda' />
              { renderValidation('name', 'Mohon isi nama Anda') }
              { renderValidation('isNameMin', 'Mohon isi nama min 3 - 30 karakter') }
            </div>
            <div className='form-group'>
              <input value={form.email} onChange={(e) => handleInput(e)} name='email' className='input-bg mail' type='email' placeholder='Email Anda' />
              { renderValidation('email', 'Mohon isi alamat email Anda') }
              { renderValidation('isEmail', 'Alamat email tidak valid') }
            </div>
            <div className='form-group'>
              <input value={form.phone} onChange={(e) => handleInput(e)} name='phone' className='input-bg phone' type='text' placeholder='Nomor Telepon' />
              { renderValidation('phone', 'Mohon isi nomor telepon Anda') }
              { renderValidation('isPhone', 'Nomor telepon Anda tidak valid') }
            </div>
          </div>
        </div>
        : <div className='form-guest'>
          <h4>Masukkan nomor telepon Anda</h4>
          <div className='form-log'>
            <div className='form-group'>
              <input value={form.phone} onChange={(e) => handleInput(e)} name='phone' className='input-bg phone' type='text' placeholder='Nomor Telepon' />
              { renderValidation('phone', 'Mohon isi nomor telepon Anda') }
              { renderValidation('isPhone', 'Nomor telepon Anda tidak valid') }
            </div>
          </div>
        </div>
      }
      {
        !authed && <div className='social-log'>
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
            icon='fab fa-facebook-f donation'
            responseFacebook={(response) => responseFacebook(response)} />
          <Google
            text=' Masuk dengan Google'
            className='google-style'
            icon='fab fa-google-plus-g donation'
            onSuccess={(response) => responseGoogleLogin(response)}
            onFailure={(response) => responseGoogleLogin(response)}
          />
        </div>
      }
      <div className='text-center'>
        <h4>Masukkan Nominal</h4>
        <p>Donasi minimal Rp 20.000 dengan kelipatan ribuan (contoh: 25.000, 50.000)</p>
      </div>
      <div className='group-donate-wrap'>
        <div className='form-nominal text-center'><span className='curency'>Rp</span>
          <input value={form.amount} name='amount' onChange={(e) => handleInput(e)} className='form-control' type='text' placeholder={0} />
          { renderValidation('amount', 'Mohon isi nominal donasi Anda') }
          { renderValidation('isAmount', 'Mohon isi donasi minimal Rp 20.000 dengan kelipatan ribuan (contoh: 25.000, 50.000)') }
          { renderValidation('isMaxAmount', 'Mohon isi donasi maximal Rp 1.000.000.000') }
        </div>
        <div className='checkbox text-center'>
          <label>
            <input value={form.anonymous} name='anonymous' type='checkbox' onChange={(e) => handleInput(e)} checked={form.anonymous} /> Donasi Sebagai Anonim
          </label>
        </div>
        <h2 className='text-center'>Tulis Komentar</h2>
        <h6>Teks saja, tanpa URL/kode html, dan emoticon.</h6>
        <div className='form-textarea'>
          <p>Tulis komentar yang mendukung campaign (opsional) <span>{countMessage}/140</span></p>
          <textarea value={form.message} name='message' onChange={(e) => handleInput(e)} className='form-control' row={50} />
        </div>
        <h3 className='text-center'>Pilih metode pembayaran</h3>
        <div className='radio-list text-center'>
          {
            banks.isFound && banks.data.map((bank, i) => (
              <div className='radio' key={i} onClick={() => handleInputBank(bank.id)}>
                <input value={bank.id} className='radio-btn' name='bank' type='radio' checked={form.bank === bank.id} />
                <label><span><span /></span> Transfer {bank.bank_name}</label>
              </div>
            ))
          }
          { renderValidation('bank', 'Mohon pilih bank transfer Anda') }
        </div>
      </div>
    </div>
    <div className='accept-nominal'>
      <div className='detail-nominal'>
        <p>Donasi Anda Rp <strong>{myDonation}</strong></p>
      </div>
      <button onClick={() => onSubmit()} className='btn btn-orange'>Lanjut</button>
    </div>
  </div>
)

const mapStateToProps = (state) => ({
  banks: state.banks,
  user: state.user,
  campaign: state.campaign,
  postDonation: state.postDonation,
  authFacebook: state.authFacebook,
  authGoogle: state.authGoogle
})

const mapDispatchToProps = (dispatch) => ({
  listBanks: () => dispatch(BanksActions.banksRequest()),
  userAuthFB: (data) => dispatch(AuthSocialActions.authFbRequest(data)),
  userAuthGoogle: (data) => dispatch(AuthSocialActions.authGoogleRequest(data)),
  getUser: () => dispatch(UserActions.userRequest()),
  getCampaignDetail: (params) => dispatch(CampaignsActions.campaignDetailRequest(params)),
  postCampaignDonations: (data) => dispatch(CampaignsActions.postCampaignDonationRequest(data)),
  postCampaignDonations2: (data) => dispatch(CampaignsActions.postCampaignDonation2Request(data))
})
export default connect(mapStateToProps, mapDispatchToProps)(Donation)
