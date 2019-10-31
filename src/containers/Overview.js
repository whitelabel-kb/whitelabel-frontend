import React from 'react'
import {connect} from 'react-redux'
import moment from 'moment'
import renderHTML from 'react-render-html'
import NotificationSystem from 'react-notification-system'
import { Link, Element, animateScroll as scroll } from 'react-scroll'
// Components
import MainContent from '../containers/MainContent2'
import PanelProfile from './PanelProfile'
import MyImage from '../components/MyImage'
import Section from '../components/Section'
import { Images } from '../themes'
import RupiahFormat from '../helpers/RupiahFormat'
import ReadAbleText from '../helpers/ReadAbleText'
import { Creators as UserActions } from '../redux/UserRedux'
import { Creators as uiActions } from '../redux/ui'

class Overview extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      myDonation: props.myDonation,
      myDonationProgress: props.myDonationProgress,
      notification: {
        message: '',
        position: 'tc',
        level: 'error'
      },
      hasMore: false,
      isEmpty: false,
      limit: 10,
      showMore: false,
      selection: ''
    }
    this.action = { getMyDonationProgress: false, getMyDonations: false }
    this._notificationSystem = null
  }

  _addNotification () {
    if (this._notificationSystem) {
      this._notificationSystem.addNotification(this.state.notification)
    }
  }

  setShowMore (progressId) {
    const { selection, showMore } = this.state
    if (progressId === selection) {
      this.setState({ showMore: !showMore, selection: progressId })
    } else {
      this.setState({ showMore: true, selection: progressId })
    }
  }

  componentDidMount () {
    this.action = { ...this.action, getMyDonations: true, getMyDonationProgress: true }
    this.props.getMyDonations()
    let params = { filter: { limit: 10 } }
    this.props.getMyDonationProgress(params)
    this.props.toogleRequest({ toogle: false })
  }

  async loadMore () {
    let { limit } = this.state
    limit = limit + 10
    this.setState({ limit })
    let params = {
      filter: {
        limit
      }
    }
    this.action = { ...this.action, getMyDonationProgress: true }
    this.props.getMyDonationProgress(params)
    scroll.scrollToTop()
  }

  componentWillReceiveProps (nextProps) {
    const { myDonationProgress, myDonation } = nextProps
    if (!myDonation.isFetching && this.action.getMyDonations) {
      this.action = { ...this.action, getMyDonations: false }
      if (myDonation.isFound) {
        this.setState({ myDonation })
      }
      if (myDonation.isFailure) {
        let notification = {
          message: myDonation.message,
          position: 'tc',
          level: 'error'
        }
        this.setState({ myDonation, notification }, () => {
          this._addNotification()
        })
      }
    }

    if (!myDonationProgress.isFetching && this.action.getMyDonationProgress) {
      this.action = { ...this.action, getMyDonationProgress: false }
      if (myDonationProgress.isFound) {
        let hasMore = myDonationProgress.meta.count > this.state.limit
        let isEmpty = myDonationProgress.meta.count < 1
        this.setState({ myDonationProgress, hasMore, isEmpty })
      }
      if (myDonationProgress.isFailure) {
        let notification = {
          message: myDonationProgress.message || 'Terjadi kesalahan saat mengambil data donasi progress',
          position: 'tc',
          level: 'error'
        }
        this.setState({ myDonationProgress, notification }, () => {
          this._addNotification()
        })
      }
    }
  }

  render () {
    const { myDonationProgress, myDonation, hasMore, isEmpty, showMore, selection } = this.state
    let amount = 0
    let totalDonation = 0

    if (myDonation.isFound) {
      amount = myDonation.data.filter(data => data.status === 1).length
      totalDonation = amount > 0 ? myDonation.data.map(data => (data.status === 1) ? data.payment.instruction.transfer_amount : 0).reduce((prev, next) => prev + next) : 0
    }
    return (
      <MainContent>
        <Section className='grey-wrapper'>
          <div className='container'>
            <div className='dashboard-wrap'>
              { <PanelProfile active='overview' /> }
              <div className='panel-table'>
                <div className='title-dashboard'>
                  <h1>Overview</h1>
                </div>
                <div className='widget-wrapper'>
                  <NotificationSystem ref={n => (this._notificationSystem = n)} />
                  <div className='widget-overview'><MyImage src={Images.love} alt='love' />
                    <div className='detail-widget'>
                      <h3>{amount}</h3>
                      <p>Donasi</p>
                    </div>
                  </div>
                  <div className='widget-overview'><MyImage src={Images.money} alt='money' />
                    <div className='detail-widget'>
                      <h3>Rp {RupiahFormat(totalDonation)}</h3>
                      <p>Donasi disalurkan</p>
                    </div>
                  </div>
                </div>
                <div className='title-dashboard'>
                  <h1>Recent Update</h1>
                </div>
                {
                  isEmpty
                  ? <EmptyProgress />
                  : <ContentProgress
                    hasMore={hasMore}
                    myDonationProgress={myDonationProgress}
                    showMore={showMore}
                    setShowMore={(progressId) => this.setShowMore(progressId)}
                    selection={selection} />
                }
                {
                  hasMore && <div className='text-center' onClick={() => this.loadMore()}>
                    <button className='btn btn-orange'>Lihat Lebih Banyak</button>
                  </div>
                }
              </div>
            </div>
          </div>
        </Section>
      </MainContent>
    )
  }
}

const ContentProgress = ({ hasMore, myDonationProgress, showMore, setShowMore, selection }) => (
  <div className='update-wrapper'>
    {
      myDonationProgress.isFound && myDonationProgress.data.map((data, i) => (
        <RecentUpdate
          key={i}
          {...data}
          showMore={showMore}
          setShowMore={setShowMore}
          selection={selection} />
      ))
    }
  </div>
)

const EmptyProgress = () => (
  <div className='log-form-wrap'>
    <div className='title-log'>
      <div className='activation-wrap'>
        <p style={{ textAlign: 'center' }}>Anda belum memiliki progress di campaign manapun.</p>
      </div>
    </div>
  </div>
)

const RecentUpdate = ({ id, title, date, content, showMore, setShowMore, selection }) => {
  return (
    <Element name={id} className={`panel-update ${showMore && selection === id ? 'view' : ''}`}>
      <h2>{ReadAbleText(title)}</h2>
      <p>{moment(date).format('DD MMM YYYY')}</p>
      {renderHTML(content)}
      {
        showMore && selection === id
        ? <Link to={id} smooth onClick={() => setShowMore(id)} className='show-more' href='#'>Baca Lebih Sedikit..</Link>
        : <Link to={id} smooth onClick={() => setShowMore(id)} className='show-more' href='#'>Baca Lebih Banyak..</Link>
      }
    </Element>
  )
}

const mapStateToProps = (state) => ({
  myDonationProgress: state.myDonationProgress,
  myDonation: state.myDonation
})

const mapDispatchToProps = (dispatch) => ({
  getMyDonationProgress: () => dispatch(UserActions.myDonationProgressRequest()),
  getMyDonations: (data) => dispatch(UserActions.myDonationRequest(data)),
  toogleRequest: (data) => dispatch(uiActions.toogleRequest(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Overview)
