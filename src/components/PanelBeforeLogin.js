import Router from 'next/router'
import { Images } from '../themes'

export default () => {
  return (
    <div className='panel-before-login'>
      <div className='before-login-menu'>
        <a className='btn btn-maroon' onClick={() => Router.push('/register')}>Daftar</a>
        <a className='btn btn-orange' onClick={() => Router.push('/login')}>Masuk</a>
        <a onClick={() => Router.push('/faq')} ><img src={Images.help} />Bantuan </a>
      </div>
    </div>
  )
}
