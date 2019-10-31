import React from 'react'
import renderHTML from 'react-render-html'
// import Router from 'next/router'
import ReactPixel from 'react-facebook-pixel'
import { Router } from '../../routes'
import { FacebookShareButton } from 'react-share'
import { Link, Element, Events, animateScroll as scroll } from 'react-scroll'
// import url from 'url'
import moment from 'moment'
import {connect} from 'react-redux'
import NotificationSystem from 'react-notification-system'
// import { CopyToClipboard } from 'react-copy-to-clipboard'
import MainContent from '../containers/MainContent'
import Section from '../components/Section'
import Container from '../components/Container'
import { imageUrl } from '../helpers/input'
import RupiahFormat from '../helpers/RupiahFormat'
import ReadAbleText from '../helpers/ReadAbleText'
import MyImage from '../components/MyImage'
import { Creators as CampaignsActions } from '../redux/CampaignRedux'
import { Creators as BanksActions } from '../redux/Bank'
import { Images } from '../themes'
const FacebookPixelId = process.env.FACEBOOK_PIXEL_ID
moment.locale('id')

class Campaign extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      banks: props.banks,
      notification: {
        message: '',
        position: 'tc',
        level: 'error'
      },
      currentUrl: '',
      pathname: '',
      copied: false,
      embedActive: {
        web: false,
        mobile: false
      },
      showMore: false,
      selected: 'newest',
      tabs: 'dekstopDetail',
      limit: 10,
      modalShareSocial: false
    }
    this._notificationSystem = null
    this.action = { getCampaignDetail: false, getCampaignDonations: false, getCampaignProgress: false, listBanks: false, moreCampaignDonations: false }
  }

  closeModal () {
    this.setState({ modalShareSocial: false })
  }

  onCopy () {
    this.setState({ copied: true })
  }

  setEmbedActive (version) {
    const { embedActive } = this.state
    let newState = { embedActive }
    newState.embedActive[version] = !embedActive[version]
    this.setState(newState)
  }

  setTabs (tabs) {
    this.setState({ tabs })
  }

  _addNotification () {
    if (this._notificationSystem) {
      this._notificationSystem.addNotification(this.state.notification)
    }
  }

  handleDonation (isActive, isTypeTarget, day, precentage, id, link, utm) {
    if ((!isActive) || (isTypeTarget && day < 0) || (isTypeTarget && precentage >= 100)) {
      return
    }
    if (utm && utm.utmSource) {
      Router.push(`/${link}/donation?utm_source=${utm.utmSource}&utm_medium=${utm.utmMedium}&utm_campaign=${utm.utmCampaign}`)
    } else {
      return Router.pushRoute(`/${link}/donation`)
    }
  }

  buttonDonation (className, utm) {
    const { data } = this.props.campaign
    let calc = Number(data.totalDonation) / Number(data.target)
    let calculate = (isNaN(calc) || isFinite(calc)) ? 0 : calc
    let precentage = calculate > 90 ? Math.floor(calculate * 100) : Math.ceil(calculate * 100)

    let now = moment(new Date()).startOf('day')
    let deadline = moment(data.deadline).startOf('day')
    let duration = moment.duration(deadline.diff(now))
    let day = duration.as('day')

    if (day === 0) {
      day = 0
    }
    if (duration < 0) {
      day = -1
    }
    let isTypeTarget = data.type === 'target'
    let disabled = ''
    let buttonText
    let unsetButton = { borderBottom: 'unset', borderColor: 'unset' }
    let setButton = false
    if ((!data.isActive) || (isTypeTarget && day < 0) || (isTypeTarget && day < 0)) {
      disabled = 'btn-disabled'
      buttonText = 'CAMPAIGN TELAH BERAKHIR'
      setButton = true
    }
    return (
      <a className={`${className} ${disabled}`}
        onClick={() => this.handleDonation(data.isActive, isTypeTarget, day, precentage, data.id, data.link, utm)}
        style={setButton ? unsetButton : {}}>
        {buttonText !== undefined ? buttonText : 'DONASI SEKARANG'}
      </a>
    )
  }

  async sortingDonatur (params) {
    const { id } = this.props.campaign.data
    this.setState({ limit: 10, selected: params.selected })
    this.action = { ...this.action, moreCampaignDonations: true }
    await this.props.getCampaignDonations({ id, params: params.param })
  }

  async loadMore (order) {
    let { limit } = this.state
    const { id } = this.props.campaign.data
    limit = limit + 10
    this.setState({ limit })
    let params = {
      filter: {
        include: ['funder'],
        where: { status: 1 },
        limit,
        order
      }
    }
    this.action = { ...this.action, moreCampaignDonations: true }
    await this.props.getCampaignDonations({ id, params })
  }

  componentDidMount () {
    const { link } = this.props
    const currentUrl = window.location.href
    const pathname = window.location.pathname
    if (link) {
      this.action = { ...this.action, getCampaignDetail: true }
      this.props.getCampaignDetail({ link })
      this.setState({ currentUrl, pathname })
    }
    setTimeout(() => {
      this.setState({ modalShareSocial: true })
    }, 3000)
    ReactPixel.init(`${FacebookPixelId}`, {}, { debug: true, autoConfig: false })
    ReactPixel.pageView()
    ReactPixel.fbq('track', 'ViewContent')
    let utmSource = this.props.url.query.utm_source
    let utmMedium = this.props.url.query.utm_medium
    let utmCampaign = this.props.url.query.utm_campaign
    if (utmSource && utmMedium && utmCampaign) {
      Router.pushRoute(`/${link}`)
    }
    Events.scrollEvent.register('begin')
    this.scrollToTop()
  }

  scrollToTop () {
    scroll.scrollToTop()
  }

  componentWillReceiveProps (nextProps) {
    const { campaign, campaignDonations, campaignProgress, banks } = nextProps

    if (!campaign.isFetching && this.action.getCampaignDetail) {
      this.action = { ...this.action, getCampaignDetail: false }
      if (campaign.isFound) {
        let params = {filter: {include: 'funder', where: { status: 1 }, limit: 10, order: 'updatedAt DESC'}}
        this.props.getCampaignDonations({ id: campaign.data.id, params })
        this.action = { ...this.action, getCampaignDonations: true }
      }
      if (campaign.isFailure) {
        let notification = {
          message: campaign.message,
          position: 'tc',
          level: 'error'
        }
        this.setState({ campaign, notification }, () => {
          this._addNotification()
        })
      }
    }

    if (!campaignDonations.isFetching && campaignDonations.isFound && this.action.getCampaignDonations) {
      this.action = { ...this.action, getCampaignDonations: false, getCampaignProgress: true }
      // let hasMore = campaignDonations.meta.count > this.state.limit
      // this.setState({ hasMore })
      let params = {
        filter: {
          order: 'id DESC'
        }
      }
      this.props.getCampaignProgress({ id: campaign.data.id, params })
    }
    if (!campaignDonations.isFetching && campaignDonations.isFailure && this.action.getCampaignDonations) {
      this.action = { ...this.action, getCampaignDonations: false, getCampaignProgress: true }
      let notification = {
        message: campaignDonations.message,
        position: 'tc',
        level: 'error'
      }
      this.setState({ campaignDonations, notification }, () => {
        this._addNotification()
      })
    }

    if (!campaignDonations.isFetching && campaignDonations.isFound && this.action.moreCampaignDonations) {
      this.action = { ...this.action, moreCampaignDonations: false }
    }
    if (!campaignDonations.isFetching && campaignDonations.isFailure && this.action.moreCampaignDonations) {
      this.action = { ...this.action, moreCampaignDonations: false }
      let notification = {
        message: campaignDonations.message,
        position: 'tc',
        level: 'error'
      }
      this.setState({ campaignDonations, notification }, () => {
        this._addNotification()
      })
    }

    if (!campaignProgress.isFetching && campaignProgress.isFound && this.action.getCampaignProgress) {
      this.action = { ...this.action, getCampaignProgress: false, listBanks: true }
      if (campaignProgress.isFound) {
        this.setState({ showMore: campaignProgress.meta.count > 1 })
        this.props.listBanks()
      }
    }
    if (!campaignProgress.isFetching && campaignProgress.isFailure && this.action.getCampaignProgress) {
      this.action = { ...this.action, getCampaignProgress: false, listBanks: true }
      let notification = {
        message: campaignProgress.message,
        position: 'tc',
        level: 'error'
      }
      this.setState({ campaignProgress, notification }, () => {
        this._addNotification()
      })
    }

    if (!banks.isFetching && banks.isFound && this.action.listBanks) {
      this.action = { ...this.action, listBanks: false }
      if (banks.isFound) {
        this.setState({ banks })
      }
      if (banks.isFailure) {
        let notification = {
          message: banks.message,
          position: 'tc',
          level: 'error'
        }
        this.setState({ banks, notification }, () => {
          this._addNotification()
        })
      }
    }
  }

  render () {
    if (!this.props.company.isFound) {
      return (
        <MainContent />
      )
    }

    const { banks, showMore, limit, tabs, selected, embedActive, currentUrl, copied, modalShareSocial } = this.state
    const { campaign, campaignDonations, campaignProgress } = this.props
    return (
      <MainContent>
        <NotificationSystem ref={n => (this._notificationSystem = n)} />
        <Section className='grey-wrapper preview'>
          { campaign.isFound && <CampaignPreview
            campaign={campaign}
            ButtonDonation={(className, utm) => this.buttonDonation(className, utm)}
            embedActive={embedActive}
            setEmbedActive={(version) => this.setEmbedActive(version)}
            currentUrl={currentUrl}
            copied={copied}
            onCopy={() => this.onCopy()}
            company={this.props.company}
             />
          }
        </Section>
        { (campaign.isFound && campaignProgress.isFound) &&
          <CampaignContents
            campaign={campaign}
            campaignProgress={campaignProgress}
            campaignDonations={campaignDonations}
            limit={limit}
            showMore={showMore}
            setShowMore={() => this.setState({ showMore: !showMore })}
            ButtonDonation={(className, utm) => this.buttonDonation(className, utm)}
            banks={banks}
            tabs={tabs}
            setTabs={(tab) => this.setTabs(tab)}
            sortingDonatur={(sort) => this.sortingDonatur(sort)}
            loadMore={(order) => this.loadMore(order)}
            selected={selected}
            embedActive={embedActive}
            setEmbedActive={(version) => this.setEmbedActive(version)}
            currentUrl={currentUrl}
            copied={copied}
            onCopy={() => this.onCopy()}
            company={this.props.company} /> }
        {
          campaign.isFound && <ModalShareSocial
            campaign={campaign}
            currentUrl={currentUrl}
            modalShareSocial={modalShareSocial}
            close={() => this.closeModal()}
            company={this.props.company} />
        }
      </MainContent>
    )
  }
}

const CampaignPreview = ({ company, campaign, ButtonDonation, embedActive, setEmbedActive, currentUrl, copied, onCopy }) => {
  const { data } = campaign
  let calc = Number(data.totalDonation) / Number(data.target)
  let calculate = (isNaN(calc) || (calc === (calc / 0))) ? 0 : calc
  let precentage = calculate > 90 ? Math.floor(calculate * 100) : Math.ceil(calculate * 100)
  let image = data.mainImage.path ? imageUrl(data.mainImage.path) : ''
  let isTypeTarget = data.type === 'target'
  let isTypeOpen = data.type === 'open'

  let now = moment(new Date()).startOf('day')
  let deadline = moment(data.deadline).startOf('day')
  let duration = moment.duration(deadline.diff(now))
  let asDay = duration.as('day')
  let day = asDay
  if (day === 0) {
    day = 'Hari Terakhir'
  }
  let isActive = data.isActive
  let donationViaLink
  if (company.isFound) {
    let titleValid = data.title.replace(/#/g, ' ')
    donationViaLink = `https://api.whatsapp.com/send?phone=${company.data.phone}&text=Donasi%20untuk%20:%20${titleValid}`
  }
  return (
    <Container>
      <div className='breadcrumb-wrapper'>
        {/* <ol className='breadcrumb'>
          <li>Home</li>
          <li className='active'><a>{data.link}</a></li>
        </ol> */}
      </div>
      <div className='title-campaign-prev'>
        <h1>{data.title}</h1>
      </div>
      <div className='row'>
        <div className='col-lg-8 col-md-8 col-sm-12 col-xs-12'>
          <div className='image-wrap'><MyImage src={image} /></div>
          <div className='text-wrap'>
            <p>{data.shortDescription}</p>
          </div>
        </div>
        <div className='col-lg-4 col-md-4 col-sm-12 col-xs-12'>
          {
            isTypeOpen && <div className='nominal-wrap'>
              <h1>Rp {RupiahFormat(data.totalDonation)}</h1>
              <h5>dana telah terkumpul</h5>
            </div>
          }
          {
            isTypeTarget && <div className='nominal-wrap'>
              <h1>Rp {RupiahFormat(data.totalDonation)}</h1>
              <h5>terkumpul dari target <strong>Rp {RupiahFormat(data.target)}</strong></h5>
            </div>
          }
          <div className='progress'>
            <div className='progress-bar progress-orange' role='progressbar' aria-valuenow={precentage} aria-valuemin={0} aria-valuemax={100} style={{ width: `${isTypeTarget ? precentage : 100}%` }} />
          </div>
          {
            <div className='detail-progress'>
              <p>
                <strong>{isTypeTarget && `${precentage} % terkumpul`} &nbsp;</strong>
                {
                  (isTypeTarget && asDay >= 1 && isActive) && <span className='right-float'><i className='far fa-clock' /> {day} Hari Lagi</span>
                }
                {
                  isTypeTarget && (asDay === 0 && isActive) && <span className='right-float'><i className='far fa-clock' /> {day}</span>
                }
                {
                  isTypeOpen && <span className='right-float'><i className='far fa-clock' /> <MyImage src={Images.infinityBlack} alt='infinity' /> Hari Lagi</span>
                }
              </p>
            </div>
          }
          <div className='button-wrap'>
            { ButtonDonation('btn btn-donate btn-maroon', {utmSource: 'campaign', utmMedium: 'direct', utmCampaign: 'page'}) }
            {
              company.data.isPublic && <a href={donationViaLink} target='_blank' className='btn btn-donate btn-wa' onClick={() => Router.push(`/${data.link}?utm_source=wa&utm_medium=sharebutton&utm_campaign=projectshare`)}><i className='fab fa-whatsapp' /> Donasi via Whatsapp</a>
            }
            <a onClick={() => Router.push(`/${data.link}?utm_source=facebook&utm_medium=sharebutton&utm_campaign=projectshare`)}>
              <FacebookShareButton
                className='btn btn-donate btn-facebook'
                style={{ lineHeight: 2 }}
                url={`${currentUrl}`}>
                <i className='fab fa-facebook-f' /> Share
              </FacebookShareButton>
            </a>
          </div>
          <div className='button-shared-wrap'>
            {/* <button className='btn btn-white btn-shared' id='show' onClick={() => setEmbedActive('web')}>Embed</button> */}
          </div>
          {/* <div className='hide-form' id='show-form' style={{display: `${embedActive.web && 'block'}`}}>
              <div className='input-group'>
                <input className='form-control' type='text' value={currentUrl} disabled />
                <CopyToClipboard text={currentUrl}
                  onCopy={() => onCopy()}>
                  <span className='input-group-btn'><button className='btn btn-white'><i className='far fa-copy' /></button></span>
                </CopyToClipboard>
              </div>
              {embedActive.web && copied && <div className='success-alert' style={{ paddingTop: '10px' }}>Berhasil disalin ke clipboard</div>}
            </div>
          </div> */}
        </div>
      </div>
    </Container>
  )
}

const CampaignContents = ({ limit, company, campaignProgress, campaignDonations, campaign, showMore, setShowMore, ButtonDonation, banks, tabs, setTabs, sortingDonatur, loadMore, selected, embedActive, setEmbedActive, currentUrl, copied, onCopy }) => {
  const { data } = campaignProgress
  let campaignTitle = campaign.data.title
  // let image = campaign.data.mainImage.path ? imageUrl(campaign.data.mainImage.path) : ''
  let donationViaLink
  if (company.isFound) {
    let titleValid = campaignTitle.replace(/#/g, ' ')
    donationViaLink = `https://api.whatsapp.com/send?phone=${company.data.phone}&text=Donasi%20untuk%20:%20${titleValid}`
  }
  if (campaignTitle.length > 52) { campaignTitle = `${campaignTitle.substring(0, 52)} ...` }
  return (
    <Section className='tabs-campaign-wrapper'>
      <div className='tab-header-campaign-wrap' id='header-camp'>
        <Container>
          <div className='row'>
            <div className='col-lg-8 col-md-8 col-sm-8 col-xs-7'>
              <ul className='nav nav-tab-campaign' role='tablist'>
                <li className='desktop active' role='presentation'>
                  <Link onClick={() => setTabs('detail')} to='detail' smooth offset={-50} aria-controls='detail' role='tab' data-toggle='tab'>Detail</Link>
                </li>
                <li className='mobile active' role='presentation'>
                  <Link onClick={() => setTabs('detail')} to='detail' smooth offset={-50} aria-controls='detail' role='tab' data-toggle='tab'>Detail</Link>
                </li>
                <li className='mobile' role='presentation'>
                  <Link onClick={() => setTabs('progress')} to='detail' smooth offset={-50} aria-controls='update' role='tab' data-toggle='tab'>Update</Link>
                </li>
                <li className='mobile' role='presentation'>
                  <Link onClick={() => setTabs('donatur')} to='detail' smooth offset={-50} aria-controls='donatur' role='tab' data-toggle='tab'>Donatur</Link>
                </li>
              </ul>
            </div>
            {/* <div className='col-lg-4 col-md-4 col-sm-4 col-xs-4'>
              <div className='title-sticky' id='show-title'>
                <h1>{ReadAbleText(campaignTitle)}</h1>
              </div>
            </div> */}
            <div className='col-lg-4 col-md-4 col-sm-4 col-xs-4'>
              <div className='button-sticky-wrap' id='show-btn'>
                {ButtonDonation('btn btn-maroon btn-donate')}
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Element name='detail' className='tab-content-campaign-wrap'>
        <Container>
          <div className='tab-content'>
            <div className='tab-pane active' id='detail' role='tabpanel'>
              <div className='row'>
                <div className='col-lg-8'>
                  <div className='tab-content'>
                    {
                      data.map((content, i) => {
                        if (i === 0) {
                          return (
                            <ProgressItem {...content}
                              showMore={showMore}
                              setShowMore={() => setShowMore()}
                              key={i}
                              isFirstData={i === 0}
                              tabs={tabs} />
                          )
                        }
                        if (i > 0 && !showMore) {
                          return (
                            <ProgressItem {...content}
                              showMore={showMore}
                              setShowMore={() => setShowMore()}
                              key={i}
                              isFirstData={i === 0}
                              tabs={tabs} />
                          )
                        }
                      })
                    }
                    <div className={`tab-pane ${(tabs === 'detail' || tabs === 'dekstopDetail') && 'active'}`}>
                      <div className='detail-campaign-white'>
                        <div className='update-date'>{moment(data.createdAt).format('DD MMM YYYY')}</div>
                        <div className='news-wrap'>
                          {/* <div className='title-news'>
                            <h1>{ReadAbleText(campaign.data.title)}</h1>
                          </div>
                          <div className='img-news'><MyImage src={image} alt='image-news' /></div> */}
                          <div className='text-news'>
                            {renderHTML(campaign.data.description)}
                          </div>
                        </div>
                      </div>
                      <div className='donater-tutor-wrap'>
                        <h4>Ayo donasi {campaign.data.title} </h4>
                        <p>Cara Berdonasi</p>
                        <p>1. Klik 'DONASI SEKARANG'</p>
                        <p>2. Pilih Bank Transfer {banks.isFound && banks.data.map(name => name.bank_code.toUpperCase()).join('/')}</p>
                        <p>3. Dapat laporan via email</p>
                      </div>
                      <div className='button-wrap bounceInDown'>
                        {ButtonDonation('btn btn-maroon btn-donate', {utmSource: 'campaign', utmMedium: 'direct', utmCampaign: 'button_bawah'}) }
                      </div>

                      <div className='button-share-mobile'>
                        {
                          company.data.isPublic && <a href={donationViaLink} target='_blank' className='btn btn-wa btn-shared' style={{ lineHeight: 2 }}><i className='fab fa-whatsapp' />
                          Donasi Via Whatsapp
                        </a>
                        }
                      </div>
                      <div className='button-share-mobile'>
                        <a className='btn btn-facebook btn-shared'><i className='fab fa-facebook-f' />
                          <FacebookShareButton
                            style={{ lineHeight: 2 }}
                            url={`${currentUrl}`}>
                            Share
                          </FacebookShareButton>
                        </a>
                        {/* <button className='btn btn-white btn-shared' id='showMobile' onClick={() => setEmbedActive('mobile')}>Embed</button> */}
                      </div>
                      {/* <div className='hide-form-mobile' id='showFormMobile' style={{display: `${embedActive.mobile && 'block'}`}}>
                        <div className='input-group'>
                          <input className='form-control' type='text' value={currentUrl} disabled />
                          <CopyToClipboard text={currentUrl}
                            onCopy={() => onCopy()}>
                            <span className='input-group-btn'><button className='btn btn-white'><i className='far fa-copy' /></button></span>
                          </CopyToClipboard>
                        </div>
                        {embedActive.mobile && copied && <div style={{ fontSize: '14px', color: '#29a803', float: 'right', paddingTop: '10px' }}>Berhasil disalin ke clipboard</div>}
                      </div> */}
                    </div>
                    <ListDonaturMobile
                      campaignDonations={campaignDonations}
                      tabs={tabs}
                      limit={limit}
                      loadMore={(order) => loadMore(order)} />
                  </div>
                </div>
                <ListDonatur
                  campaignDonations={campaignDonations}
                  sortingDonatur={(sort) => sortingDonatur(sort)}
                  tabs={tabs}
                  loadMore={(order) => loadMore(order)}
                  limit={limit}
                  selected={selected}
                  />
              </div>
            </div>
          </div>
        </Container>
      </Element>
      <div className='button-fixed-bottom'>
        { ButtonDonation('btn btn-maroon', {utmSource: 'campaign', utmMedium: 'direct', utmCampaign: 'button_bawah'}) }
      </div>
    </Section>
  )
}

const ProgressItem = ({ title, date, isFirstData, showMore, setShowMore, content, strip, tabs }) => {
  return (
    <div className={`tab-pane ${(tabs === 'progress' || tabs === 'dekstopDetail') && 'active'}`}>
      <div className='detail-campaign-grey'>
        <div className='update-title'>{ReadAbleText(title)}</div>
        <div className='update-date'>{moment(date).format('DD MMMM YYYY')}</div>
        <div className='news-wrap'>
          {
            renderHTML(content)
          }
          {/* <div className='title-news'>
            <h1>{ReadAbleText('opowae')}</h1>
          </div>
          <div className='img-news'><img src={imageUrl('')} alt='image-news' /></div>
          <div className='text-news'>
            <p>{'opowae'}</p>
          </div> */}
          {
            (showMore && isFirstData) && <div name='progress2' className='text-news'>
              <a className='show-more' href='#'><Link onClick={() => setShowMore()} to='progress2' smooth offset={-50}>Lihat Lebih Banyak..</Link></a>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

const ListDonatur = ({ limit, campaignDonations, sortingDonatur, tabs, selected, loadMore }) => {
  let sortByTime = {filter: {include: 'funder', where: { status: 1 }, limit: 10, order: 'updatedAt DESC'}}
  let sortByMount = {filter: {include: 'funder', where: { status: 1 }, limit: 10, order: 'amount DESC'}}
  return (
    <div className='col-lg-4'>
      <div className='sideright-campaign-wrap'>
        <h4>Donatur ({ campaignDonations.meta.count })</h4>
        <div className='side-tabs-wrap'>
          <p>Urutkan: </p>
          <ul className='nav nav-tab-side' role='tablist'>
            <li onClick={() => sortingDonatur({ param: sortByTime, selected: 'newest' })} className={selected === 'newest' ? 'active' : ''} role='presentation'><a href='#waktu' aria-controls='detail' role='tab' data-toggle='tab'>Waktu</a></li>
            <li onClick={() => sortingDonatur({ param: sortByMount, selected: 'many' })} className={selected === 'many' ? 'active' : ''} role='presentation'><a href='#jumlah' aria-controls='pesan' role='tab' data-toggle='tab'>Jumlah</a></li>
          </ul>
        </div>
        <div className='tab-content'>
          <div className={`tab-pane ${(tabs === 'dekstopDetail') && 'active'}`} id='waktu' role='tabpanel'>
            {
              campaignDonations.isFound && campaignDonations.data.map((data, i) => <Donatur {...data} key={i} />)
            }
            {
              (campaignDonations.meta.count > limit) && <div className='text-center'>
                <button className='btn btn-orange' onClick={() => loadMore('updatedAt DESC')}>Lihat Lebih Banyak</button>
              </div>
            }
          </div>
          <div className='tab-pane' id='jumlah' role='tabpanel'>
            {
              campaignDonations.isFound && campaignDonations.data.map((data, i) => <Donatur {...data} key={i} />)
            }
            {
              (campaignDonations.meta.count > limit) && <div className='text-center'>
                <button className='btn btn-orange' onClick={() => loadMore('amount DESC')}>Lihat Lebih Banyak</button>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

const ListDonaturMobile = ({ campaignDonations, limit, tabs, loadMore }) => {
  return (
    <Element name='donatur' className={`tab-pane ${tabs === 'donatur' && 'active'}`} id='donaturMobile' role='tabpanel'>
      {
        campaignDonations.isFound && campaignDonations.data.map((data, i) => <Donatur {...data} key={i} />)
      }
      {
        (campaignDonations.meta.count > limit) && <div className='text-center'>
          <button className='btn btn-orange' onClick={() => loadMore('updatedAt DESC')}>Lihat Lebih Banyak</button>
        </div>
      }
    </Element>
  )
}
const Donatur = ({ payment, name, updatedAt, message, funder, isAnonymous }) => {
  let photo = (funder && funder.profilePhoto) ? imageUrl(funder.profilePhoto.path) : Images.donatur
  return (
    <div className='donatur-list-wrap'>
      <div className='donatur-image'><MyImage src={photo} /></div>
      <div className='donatur-detail'>
        <h3>Rp {RupiahFormat(payment.instruction.transfer_amount)}</h3>
        <h4>{isAnonymous ? 'Anonim' : ReadAbleText(name)}</h4>
        <h5>{moment(updatedAt).format('DD MMMM YYYY hh:mm')}</h5>
        <p>{message}</p>
      </div>
    </div>
  )
}

const ModalShareSocial = ({ modalShareSocial, close, campaign, currentUrl, company }) => {
  const companyName = company.isFound ? company.data.name : ''
  const { data } = campaign
  return (
    <div className='modal in' role='dialog' style={{display: `${modalShareSocial ? 'block' : 'none'}`}}>
      <div className='modal-dialog' role='document'>
        <div className='modal-content'>
          <div className='modal-body'>
            <div className='modal-body-top'><a onClick={() => close()} className='closed' type='button' aria-label='Close'><span className='fas fa-times' aria-hidden='true' /></a>
              <div className='detail-modal-wrap'>
                <div className='image-detail-modal'><MyImage src={imageUrl(data.mainImage.path)} /></div>
                <div className='text-detail-modal'>
                  <h1>Mohon Bantuannya</h1>
                  <h5>Share campaign <span className='text-cyan'>{data.title}</span> ke Facebook</h5>
                  <p>— {ReadAbleText(companyName)}</p>
                </div>
              </div>
            </div>
            <div className='modal-body-bottom'>
              <div className='modal-bottom-content'>
                <div className='text-modal-bottom'>
                  <p>Faktanya, <strong>1 share ke Facebook</strong> rata-rata membawa donasi senilai <strong>Rp 250.000</strong></p>
                </div>
                <div className='button-modal-bottom' onClick={() => Router.push(`/${data.link}?utm_source=facebook&utm_medium=modal&utm_campaign=userreff`)}>
                  <FacebookShareButton
                    className='btn btn-facebook btn-shared'
                    style={{ lineHeight: 2 }}
                    url={`${currentUrl}`}>
                    <i className='fab fa-facebook-f' /> Share
                  </FacebookShareButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  banks: state.banks,
  campaign: state.campaign,
  campaignDonations: state.campaignDonations,
  campaignProgress: state.campaignProgress,
  company: state.company
})

const mapDispatchToProps = (dispatch) => ({
  listBanks: () => dispatch(BanksActions.banksRequest()),
  getCampaignDetail: (params) => dispatch(CampaignsActions.campaignDetailRequest(params)),
  getCampaignDonations: (params) => dispatch(CampaignsActions.campaignDonationsRequest(params)),
  getCampaignProgress: (params) => dispatch(CampaignsActions.campaignProgressRequest(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(Campaign)
