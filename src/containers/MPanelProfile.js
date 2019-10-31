import React from 'react'
import {connect} from 'react-redux'
import ProfileMenu from '../components/ProfileMenu'
import ReadAbleText from '../helpers/ReadAbleText'
import RupiahFormat from '../helpers/RupiahFormat'
import { imageUrl } from '../helpers/input'
import { Images } from '../themes'
import MyImage from '../components/MyImage'
import { Creators as UserActions } from '../redux/UserRedux'

class PanelProfile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      myDonation: props.myDonation
    }
    this.action = { getMyDonations: false }
  }

  componentDidMount () {
    if (!this.state.myDonation.isFound) {
      this.action = { ...this.action, getMyDonations: true }
      this.props.getMyDonations()
    }
  }

  componentWillReceiveProps (nextProps) {
    const { myDonation } = nextProps

    if (!myDonation.isFetching && this.action.getMyDonations) {
      this.action = { ...this.action, getMyDonations: false }
      if (myDonation.isFound) {
        this.setState({ myDonation })
      }
      if (myDonation.isFailure) {
        let notification = {
          message: myDonation.message,
          status: true,
          type: 'danger'
        }
        this.setState({ myDonation, notification })
      }
    }
  }

  render () {
    const { myDonation } = this.state
    const { user } = this.props
    let userName = ''
    let photo = ''
    if (!user.isFetching && user.isFound) {
      const { name, profilePhoto } = user.data
      userName = ReadAbleText(name)
      photo = profilePhoto ? imageUrl(profilePhoto.path) : ''
    }
    let amount = 0
    let totalDonation = 0
    if (myDonation.isFound) {
      amount = myDonation.data.filter(data => data.status === 1).length
      totalDonation = amount > 0 ? myDonation.data.map(data => (data.status === 1) ? data.payment.instruction.transfer_amount : 0).reduce((prev, next) => prev + next) : 0
    }
    return (
      <div className='panel-profile-mobile'>
        <div className='profile-detail'>
          <div className='image-profile'><MyImage className='img-circle' src={photo} alt='image' /></div>
          <div className='name-profile'>{userName}</div>
        </div>
        <div className='profile-widget'>
          <div className='widget-profile'><MyImage src={Images.love} alt='image' />
            <div className='widget-text'>
              <p>Campaign yang diikuti</p>
              <h4>{amount}</h4>
            </div>
          </div>
          <div className='widget-profile'><MyImage src={Images.money} alt='image' />
            <div className='widget-text'>
              <p>Donasi yang disalurkan</p>
              <h4>Rp {RupiahFormat(totalDonation)}</h4>
            </div>
          </div>
        </div>
        <ProfileMenu />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  myDonation: state.myDonation
})

const mapDispatchToProps = (dispatch) => ({
  getMyDonations: (data) => dispatch(UserActions.myDonationRequest(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(PanelProfile)
