import { Link } from '../../routes'
// import ReadAbleText from '../helpers/ReadAbleText'
import { imageUrl } from '../helpers/input'
import MyImage from '../components/MyImage'

export default ({ campaign }) => {
  let image = (campaign.mainImage && campaign.mainImage.path) ? imageUrl(campaign.mainImage.path) : ''
  return (
    // exp client side <Link route={`campaign`} params={{ urlLink: `${campaign.link}` }}>
    <Link href={`/${campaign.link}?utm_source=campaign&utm_medium=payment-summary&utm_campaign=recommended`} >
      <div className='camp-panel'>
        <div className='camp-panel-hover'>Donasi ke Campaign Ini</div>
        <div className='camp-panel-img'><MyImage src={image} alt='image' /></div>
        <div className='camp-panel-text'>
          <h1>{campaign.title}</h1>
          <p>{campaign.shortDescription}</p>
        </div>
      </div>
    </Link>
  )
}
