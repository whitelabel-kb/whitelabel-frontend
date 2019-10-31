import { Link } from '../../routes'
import moment from 'moment'
import RupiahFormat from '../helpers/RupiahFormat'
// import ReadAbleText from '../helpers/ReadAbleText'
import { imageUrl } from '../helpers/input'
import { Images } from '../themes'
import MyImage from '../components/MyImage'

export default ({ campaign }) => {
  let calc = Number(campaign.totalDonation) / Number(campaign.target)
  let calculate = (isNaN(calc) || (calc === (calc / 0))) ? 0 : calc
  let precentage = (calculate > 99 && calculate < 100) ? Math.floor(calculate * 100) : Math.ceil(calculate * 100)

  let now = moment(new Date()).startOf('day')
  let deadline = moment(campaign.deadline).startOf('day')
  let duration = moment.duration(deadline.diff(now))
  let asDay = duration.as('day')
  let day = asDay
  if (day === 0) {
    day = 'Hari Terakhir'
  }
  let isActive = campaign.isActive
  if (duration < 0 || !isActive) {
    day = 'Selesai'
  }
  let isTypeTarget = campaign.type === 'target'
  let isTypeOpen = campaign.type === 'open'
  let image = (campaign.mainImage && campaign.mainImage.path) ? imageUrl(campaign.mainImage.path) : ''
  return (
    <div className='col-lg-4 col-md-4 col-sm-12 col-xs-12'>
      <Link route={`campaign`} params={{ urlLink: `${campaign.link}` }}>
        <a>
          <div className='campaign-box'>
            <div className='image-campaign-box'><MyImage src={image} alt='image' /></div>
            <div className='detail-campaign-box'>
              <div className='title-campaign-box'>
                <h2>{campaign.title}</h2>
              </div>
              <div className='donate-campaign-box'>{/* 'open-campaign' */}
                <p>Pencapaian <span>{isTypeTarget && `${precentage} %`}</span></p>
                <div className='progress'>
                  <div className='progress-bar progress-maroon' role='progressbar' aria-valuenow={80} aria-valuemin={0} aria-valuemax={100} style={{width: `${isTypeTarget ? precentage : 100}%`}} />
                </div>
                <div className='donate-detail'>
                  <div className='nominal-wrap'>
                    <h4>Rp {RupiahFormat(campaign.totalDonation)}</h4>
                    <p>Terkumpul</p>
                  </div>
                  {
                    (isTypeTarget && asDay >= 1 && isActive) && <div className='day-wrap'>
                      <h4>{day}</h4>
                      <p>Hari Lagi</p>
                    </div>
                  }
                  {
                    isTypeTarget && (asDay < 1 || !isActive) && <div className='day-wrap'>
                      <h4>{day}</h4>
                    </div>
                  }
                  {
                    (isTypeOpen && isActive) && <div className='day-wrap'>
                      <h4><MyImage src={Images.infinity} alt='infinity' /></h4>
                      <p>Hari Lagi</p>
                    </div>
                  }
                  {
                    isTypeOpen && !isActive && <div className='day-wrap'>
                      <h4>Selesai</h4>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </div>
  )
}
