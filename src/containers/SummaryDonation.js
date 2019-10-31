import React from 'react'
import {connect} from 'react-redux'
import moment from 'moment'
import Router from 'next/router'
import { FacebookShareButton, WhatsappShareButton } from 'react-share'
import { animateScroll as scroll } from 'react-scroll'
import ReactPixel from 'react-facebook-pixel'
// Components
import NotificationSystem from 'react-notification-system'
import MainContent from './MainContent2'
import Section from '../components/Section'
import Container from '../components/Container'
import CampaignItem from '../components/CampaignItem2'
import { Images } from '../themes'
import MyImage from '../components/MyImage'
import RupiahFormat from '../helpers/RupiahFormat'
import ReadAbleText from '../helpers/ReadAbleText'
import getToken from '../services/GetToken'
import { Creators as CampaignsActions } from '../redux/CampaignRedux'
const FacebookPixelId = process.env.FACEBOOK_PIXEL_ID
moment.locale('id')

class Donation extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      authed: null,
      hostname: '',
      notification: {
        message: '',
        position: 'tc',
        level: 'error'
      }
    }
    this._notificationSystem = null
    this.action = { getCampaignDetail: false, listCampaigns: false, getDetailDonation: false }
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
    const { link, campaigns, donationId } = this.props
    if (link) {
      this.action = { ...this.action, getCampaignDetail: true }
      this.props.getCampaignDetail({ link })
    }
    if (!campaigns.isFound) {
      this.action = { ...this.action, listCampaigns: true }
      let params = {
        filter: {
          where: { isPublished: true },
          limit: 5,
          order: 'createdAt DESC'
        }
      }
      this.props.listCampaigns(params)
    }
    window.addEventListener('popstate', (event) => {
      Router.push('/')
    }, false)
    let utmSource = this.props.url.query.utm_source
    let utmMedium = this.props.url.query.utm_medium
    let utmCampaign = this.props.url.query.utm_campaign
    if (utmSource && utmMedium && utmCampaign) {
      Router.pushRoute(`/${link}/summary/${donationId}`)
    }
    scroll.scrollToTop()
  }

  componentWillReceiveProps (nextProps) {
    const { campaign, detailDonation, campaigns } = nextProps
    const { isFetching, isFound, isFailure } = campaign

    if (!isFetching && this.action.getCampaignDetail) {
      this.action = { ...this.action, getCampaignDetail: false, getDetailDonation: true }
      if (isFound) {
        let params = { campaignId: campaign.data.id, donationId: this.props.donationId }
        this.props.getDetailDonation(params)
      }
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

    if (!detailDonation.isFetching && this.action.getDetailDonation) {
      this.action = { ...this.action, getDetailDonation: false }
      if (detailDonation.isFound) {
      }
      if (detailDonation.isFailure) {
        let notification = {
          message: detailDonation.message,
          position: 'tc',
          level: 'error'
        }
        this.setState({ notification }, () => {
          this._addNotification()
        })
      }
    }

    if (!campaigns.isFetching && this.action.listCampaigns) {
      this.action = { ...this.action, listCampaigns: false }
      if (campaigns.isFailure) {
        let notification = {
          message: campaigns.message,
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
    const { hostname } = this.state
    const { campaign, campaigns, detailDonation } = this.props
    if (detailDonation.isFound) {
      // if (window && window.dataLayer) {
      //   window.dataLayer = window.dataLayer || []
      //   window.dataLayer.push({
      //     'transferAmount': `${detailDonation.data.payment.instruction.transfer_amount}`
      //   })
      // }
      ReactPixel.init(`${FacebookPixelId}`, {}, { debug: false, autoConfig: false })
      ReactPixel.pageView()
      ReactPixel.fbq('track', 'Purchase', {
        value: detailDonation.data.payment.instruction.transfer_amount,
        currency: 'IDR'
      })
    }
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
                  <div className='icon-flow-donate'><img src={Images.card} alt='card' />
                    <p>Bayar</p>
                  </div>
                </div>
                <div className='sparator-vertical orange-sparator' />
              </div>
              {
                detailDonation.isFound && <PostDonation {...detailDonation.data} />
              }
              { detailDonation.isFound && <ExpiredDonation {...detailDonation.data} /> }
              { campaign.isFound && <ShareCampaign campaign={campaign} hostname={hostname} />}
              { campaigns.isFound && <OtherCampaigns campaigns={campaigns} />}
            </div>
          </Container>
        </Section>
      </MainContent>
    )
  }
}

const PostDonation = ({ amount, payment, bank_logo }) => {
  let uniqueCode = Number(payment.instruction.transfer_amount) - Number(amount)
  if (String(uniqueCode).length < 3) { // unicode must 3 digit
    if (String(uniqueCode).length === 1) {
      uniqueCode = `00${uniqueCode}`
    }
    if (String(uniqueCode).length === 2) {
      uniqueCode = `0${uniqueCode}`
    }
  }
  let FormatRupiah = RupiahFormat(payment.instruction.transfer_amount)
  let countCode = String(uniqueCode).length
  let slicePrice = String(FormatRupiah).slice(0, -countCode)
  return (
    <div className='form-wrap'>
      <div className='detail-transaction-table'>
        <table className='table-unbordered' border={0}>
          <tbody>
            <tr>
              <td className='td-title'>Nominal Donasi</td>
              <td>Rp</td>
              <td>{RupiahFormat(amount)}</td>
            </tr>
            <tr>
              <td>Kode Unik (akan didonasikan)</td>
              <td>Rp</td>
              <td>{uniqueCode}</td>
            </tr>
            <tr className='bortop'>
              <td><strong>Total</strong></td>
              <td><strong>Rp</strong></td>
              <td><strong>{slicePrice}<span className='text-orange glow'>{uniqueCode}</span></strong></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='carret-box'><img src={Images.yellowCarret} alt='icon' /></div>
      <div className='yellow-box'>PENTING, transfer sampai {countCode} digit terakhir agar donasi Anda dapat diproses.</div>
      <div className='bank-detail-wrap'>
        <div className='bank-image'>
          <h5>Silakan transfer ke</h5><MyImage src={payment.instruction.bank_logo} alt='bank' />
        </div>
        <div className='bank-detail'>
          <h5>{payment.instruction.acc_number}</h5>
          <p>Atas nama: {payment.instruction.acc_holder}</p>
          <p>Cabang: {payment.instruction.bank_branch}</p>
          <p>{`${payment.instruction.bank_name} (${payment.instruction.bank_short_name})`}</p>
        </div>
      </div>
      <p>Kamu dapat transfer menggunakan channel apapun (ATM, mobile banking, SMS banking, atau teller) selama tujuan transfer sesuai dengan bank yang dipilih.</p>
    </div>
  )
}

const ExpiredDonation = ({ payment }) => (
  <div className='form-wrap'>
    <p>Pastikan Anda transfer sebelum <strong>{moment(payment.expired_at.date).format('LLLL')}</strong> atau donasi Anda otomatis dibatalkan oleh sistem.</p>
  </div>
)

const ShareCampaign = ({ campaign, hostname }) => {
  let campaignTitle = ''
  let shareUrl = ''
  if (campaign.isFound) {
    const { title, link } = campaign.data
    shareUrl = `http://${hostname}/${link}`
    campaignTitle = title
  }
  return (
    <div className='form-wrap'>
      <div className='shared-panel text-center'>
        <h1>Happiness is only real when shared!</h1>
        <h2>Bantu <strong>{ReadAbleText(campaignTitle)}</strong> Mencapai target Donasinya</h2>
        <div className='button-wrap bayar' >
          <FacebookShareButton
            onClick={() => campaign.isFound && Router.push(`/${campaign.data.link}/summary/${campaign.data.id}?utm_source=facebook&utm_medium=sharebutton&utm_campaign=projectshare`)}
            className='btn btn-donate btn-facebook'
            style={{ lineHeight: 2 }}
            url={`${shareUrl}`}>
            <i className='fab fa-facebook' /> Share Facebook
          </FacebookShareButton>
          <WhatsappShareButton
            title={campaignTitle}
            url={shareUrl}>
            <button className='btn btn-donate btn-wa' onClick={() => campaign.isFound && Router.push(`/${campaign.data.link}/summary/${campaign.data.id}?utm_source=wa&utm_medium=sharebutton&utm_campaign=projectshare`)}><i className='fab fa-whatsapp' /> Share Whatsapp</button>
          </WhatsappShareButton>
        </div>
      </div>
    </div>
  )
}

const OtherCampaigns = ({campaigns}) => (
  <div className='other-campaign-wrap'>
    <h3>Campaign lain yang butuh bantuan Anda:</h3>
    {
      campaigns.data.map((campaign, i) => {
        return (
          <CampaignItem campaign={campaign} key={i} />
        )
      })
    }
  </div>
)

const mapStateToProps = (state) => ({
  campaign: state.campaign,
  detailDonation: state.getDetailDonation,
  campaigns: state.campaigns
})

const mapDispatchToProps = (dispatch) => ({
  getCampaignDetail: (params) => dispatch(CampaignsActions.campaignDetailRequest(params)),
  getDetailDonation: (data) => dispatch(CampaignsActions.getDetailCampaignDonationRequest(data)),
  listCampaigns: (data) => dispatch(CampaignsActions.campaignsRequest(data))
})
export default connect(mapStateToProps, mapDispatchToProps)(Donation)
