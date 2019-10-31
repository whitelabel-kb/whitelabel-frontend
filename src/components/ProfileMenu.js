import Link from 'next/link'
import Logout from '../containers/Logout'

export default ({ active }) => {
  return (
    <div className='profile-menu'>
      <ul className='list-unstyled'>
        <li className={`${active === 'overview' ? 'active' : ''}`}><Link href='/overview'><a><i className='far fa-chart-bar' /> Overview</a></Link></li>
        <li className={`${active === 'history' ? 'active' : ''}`}><Link href='/history' prefetch><a><i className='far fa-heart' /> Donasi Saya</a></Link></li>
        <li className={`${active === 'editProfile' ? 'active' : ''}`}><Link href='/profile' prefetch><a><i className='far fa-user' /> Edit Profile</a></Link></li>
        <li className={`${active === 'updatePassword' ? 'active' : ''}`}><Link href='change-password' as='/change/password'><a><i className='fas fa-lock' /> Edit Kata Sandi</a></Link></li>
        <li><Logout /></li>
      </ul>
    </div>
  )
}
