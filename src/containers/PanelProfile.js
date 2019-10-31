import React from 'react'
import {connect} from 'react-redux'
import ReadAbleText from '../helpers/ReadAbleText'
import { imageUrl } from '../helpers/input'
import MyImage from '../components/MyImage'
import ProfileMenu from '../components/ProfileMenu'
import { Creators as UserActions } from '../redux/UserRedux'
import { Images } from '../themes'

class PanelProfile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      active: 'haha'
    }
  }

  componentDidMount () {
    if (!this.props.user.isFound) {
      this.props.getUser()
    }
  }

  render () {
    const { active } = this.props
    const { user } = this.props
    let userName = ''
    let photo = ''
    if (!user.isFetching && user.isFound) {
      const { name, profilePhoto } = user.data
      userName = ReadAbleText(name)
      photo = profilePhoto ? imageUrl(profilePhoto.path) : Images.donatur
    }
    return (
      <div className='panel-profile'>
        <div className='profile-detail'>
          <div className='image-profile'><MyImage className='img-circle' src={photo} alt='img' /></div>
          <div className='name-profile'>{userName}</div>
        </div>
        <ProfileMenu active={active} />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user
})

const mapDispatchToProps = (dispatch) => ({
  getUser: () => dispatch(UserActions.userRequest())
})

export default connect(mapStateToProps, mapDispatchToProps)(PanelProfile)
