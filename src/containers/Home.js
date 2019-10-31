import React from 'react'
import {connect} from 'react-redux'
import NotificationSystem from 'react-notification-system'
import { Router } from '../../routes'
// Components
import MainContent from '../containers/MainContent'
import Section from '../components/Section'
import Container from '../components/Container'
import Banner from './Banner'
import CampaignItem from '../components/CampaignItem'
import { Creators as CampaignsActions } from '../redux/CampaignRedux'

class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      limit: 9
    }
    this._notificationSystem = null
  }

  _addNotification () {
    if (this._notificationSystem) {
      this._notificationSystem.addNotification({
        message: 'Notification message',
        position: 'tc',
        level: 'success'
      })
    }
  }

  componentDidMount () {
    let params = {
      filter: {
        where: { isPublished: true, isFeatured: true },
        limit: 9,
        order: ['isActive DESC', 'totalDonation DESC', 'searchCounter DESC']
      }
    }
    this.props.listCampaigns(params)
  }

  render () {
    const { company, campaigns } = this.props
    return (
      <MainContent>
        <NotificationSystem ref={n => (this._notificationSystem = n)} />
        <Section className='landing-banner-wrapper'>
          { company.isFound && <Banner {...company.data} /> }
        </Section>
        <Section className='grey-wrapper-index'>
          <Container>
            <div className='title-landing-wrap'>
              <h1>CAMPAIGN PILIHAN</h1>
              <h3>Cari, pilih salurkan untuk campaign yang anda inginkan</h3>
            </div>
            <div className='campaign-list-wrap'>
              <div className='row'>
                {
                  campaigns.isFound && campaigns.data.map((campaign, i) => {
                    if (campaign.isPublished) {
                      return (
                        <CampaignItem campaign={campaign} key={i} />
                      )
                    }
                  })
                }
                <div className='col-xs-12 text-center'>
                  {(campaigns.isFound) && <button className='btn btn-orange' onClick={() => Router.pushRoute('/explore')}>Lihat Lebih Banyak</button>}
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </MainContent>
    )
  }
}

const mapStateToProps = (state) => ({
  company: state.company,
  campaigns: state.campaigns
})
const mapDispatchToProps = (dispatch) => ({
  listCampaigns: (data) => dispatch(CampaignsActions.campaignsRequest(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
