import renderHTML from 'react-render-html'
import Link from 'next/link'
import { Images } from '../themes'
import { imageUrl } from '../helpers/input'
import MyImage from '../components/MyImage'

export default ({ address, secondAddress, companyLogo, facebook, instagram, twitter, youtube, link }) => {
  let image = (companyLogo && companyLogo.path) ? imageUrl(companyLogo.path) : ''
  return (
    <footer>
      <div className='footer-default'>
        <div className='footer-top'>
          <div className='container'>
            <div className='footer-flex-top'>
              <div className='footer-logo'><MyImage src={image} alt='LOGO' /></div>
              <div className='footer-social'>Temukan kami di:
                <ul className='list-unstyled'>
                  <li><Link href={facebook}><a target='_blank'><img src={Images.fb} alt='image' /></a></Link></li>
                  <li><Link href={instagram}><a target='_blank'><img src={Images.ig} alt='image' /></a></Link></li>
                  <li><Link href={twitter}><a target='_blank'><img src={Images.tw} alt='image' /></a></Link></li>
                  <li><Link href={youtube}><a target='_blank'><img src={Images.yt} alt='image' /></a></Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className='footer-bottom'>
          <div className='container'>
            <div className='row'>
              <div className='col-lg-4 col-md-4 col-sm-12 col-xs-12'>
                <h2>Kantor Pusat:</h2>
                {renderHTML(address)}
              </div>
              <div className='col-lg-5 col-md-4 col-sm-12 col-xs-12'>
                <h2>Kantor Pendukung:</h2>
                {renderHTML(secondAddress)}
              </div>
              <div className='col-lg-3 col-md-4 col-sm-12 col-xs-12'>
                <h2>Take Action</h2>
                <ul className='list-unstyled'>
                  {
                    link.length > 0 && link.map((data, i) => {
                      if (data.name === 'Bantuan') {
                        return <li key={i}><Link href='/faq'>{data.name}</Link></li>
                      } else {
                        return (<li key={i}><a target='_blank' href={data.link}>{data.name}</a></li>)
                      }
                    })
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
