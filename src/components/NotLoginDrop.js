import Link from 'next/link'

export default () => {
  return (
    <ul className='dropdown-menu' id='dLabel'>
      <li><Link href='/register'><a>Daftar</a></Link></li>
      <li><Link href='/login'><a>Masuk</a></Link></li>
      <li><Link href='/faq'><a>Bantuan</a></Link></li>
    </ul>
  )
}
