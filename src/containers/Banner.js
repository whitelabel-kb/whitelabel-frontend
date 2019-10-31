import React from 'react'
import { Router } from '../../routes'
import MyImage from '../components/MyImage'
import { imageUrl } from '../helpers/input'
import RupiahFormat from '../helpers/RupiahFormat'

const Banner = ({ bannerTitle, bannerSubtitle, companyBanner, companyMobileBanner, totalCampaign, totalDonation, totalDonor }) => {
  let image = companyBanner.path ? imageUrl(companyBanner.path) : ''
  let imageMobile = companyMobileBanner.path ? imageUrl(companyMobileBanner.path) : ''
  totalCampaign = !totalCampaign ? 0 : totalCampaign
  totalDonation = !totalDonation ? 0 : totalDonation
  totalDonor = !totalDonor ? 0 : totalDonor
  return (
    <div className='banner-image'>
      <MyImage className='d_banner' src={image} alt='banner' />
      <MyImage className='m_banner' src={imageMobile} alt='banner' />
      <div className='banner-text text-center'>
        <h1>{bannerTitle}</h1>
        <h3>{bannerSubtitle}</h3>
        <a className='btn btn-orange banner' onClick={() => Router.pushRoute('/explore')}>Donasi Sekarang</a>
      </div>
      <div className='banner-sticky text-center'>
        <div className='container'>
          <div className='row'>
            <div className='col-xs-4'>
              <h2>{RupiahFormat(totalCampaign)}</h2>
              <p>Campaign Terdanai</p>
            </div>
            <div className='col-xs-4'>
              <h2>Rp {RupiahFormat(totalDonation)}</h2>
              <p>Donasi Terkumpul</p>
            </div>
            <div className='col-xs-4'>
              <h2>{RupiahFormat(totalDonor)}</h2>
              <p>Donatur</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Banner
