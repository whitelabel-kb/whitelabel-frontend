import React from 'react'
import moment from 'moment'
import {connect} from 'react-redux'
import CampaignItem from '../components/CampaignItem'
import { Creators as CampaignsActions } from '../redux/CampaignRedux'
moment.locale('id')

class Campaign extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      campaigns: props.campaigns
    }
  }

  componentDidMount () {
    if (!this.state.campaigns.isSearch) {
      let params = {
        filter: {
          where: { isPublished: true },
          limit: 9,
          order: ['isActive DESC', 'totalDonation DESC', 'searchCounter DESC']
        }
      }
      this.props.listCampaigns(params)
    }
  }

  componentWillReceiveProps (nextProps) {
    const { campaigns } = nextProps
    const { isFetching, isFound, isFailure } = campaigns

    if (!isFetching) {
      if (isFound) {
        let isEmpty = campaigns.data.filter(data => data.isPublished).length < 1
        if (isEmpty) {
          let notification = {
            message: 'Hasil pencarian campaign tidak ada',
            status: true,
            type: 'danger'
          }
          this.setState({ notification })
        }
        this.setState({ campaigns })
      }
      if (isFailure) {
        let notification = {
          message: campaigns.message,
          status: true,
          type: 'danger'
        }
        this.setState({ campaigns, notification })
      }
    }
  }

  render () {
    const { campaigns } = this.state
    return (
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
            {(campaigns.isFound && campaigns.meta.count > this.props.limit) && <button className='btn btn-orange' onClick={() => this.props.loadMoreCampaigns()}>Lihat Lebih Banyak</button>}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  campaigns: state.campaigns
})

const mapDispatchToProps = (dispatch) => ({
  listCampaigns: (data) => dispatch(CampaignsActions.campaignsRequest(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Campaign)
