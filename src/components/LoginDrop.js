import ReadAbleText from '../helpers/ReadAbleText'
import Router from 'next/router'
import { imageUrl } from '../helpers/input'
import MyImage from '../components/MyImage'
import { Images } from '../themes'
import Logout from '../containers/Logout'

export default ({ name, email, profilePhoto }) => {
  let image = (profilePhoto && profilePhoto.path) ? imageUrl(profilePhoto.path) : Images.donatur
  return (
    <ul className='dropdown-menu login-drop' id='dLabel'>
      <li className='profile-dropdown'>
        <div className='profile-dropdown-wrap'><MyImage src={image} alt='image' />
          <div className='profile-detail'>
            {!!name && ReadAbleText(name)}<br />
            <span>{!!email && email}</span>
          </div>
        </div>
      </li>
      <li className='button-dropdown'>
        <div className='button-dropdown-wrap' onClick={() => Router.push('/overview')}><a className='btn btn-orange'>Dashboard</a></div>
      </li>
      <li className='logout-dropdown'>
        <Logout />
      </li>
    </ul>
  )
}
