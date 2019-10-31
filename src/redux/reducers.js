import { combineReducers } from 'redux'
import toogle, { searchText } from './ui'
import auth, { logoutReducer as logout, forgotPasswordReducer as forgotPassword } from './AuthRedux'
import authFacebook, { authGoogleReducer as authGoogle } from './AuthSocial'
import company from './Company'
import user, { updateUserReducer as updateUser, photoUserReducer as photoUser, myDonationReducer as myDonation, myDonationProgressReducer as myDonationProgress, changePasswordReducer as changePassword } from './UserRedux'
import {campaignsReducer as campaigns, campaignReducer as campaign, campaignDonationsReducer as campaignDonations, campaignProgressReducer as campaignProgress, postCampaignDonationReducer as postDonation, getDetailCampaignDonationReducer as getDetailDonation} from './CampaignRedux'
import categories from './Categories'
import banks from './Bank'
import provinces, { citiesReducer as cities } from './Location'

export default combineReducers({
  auth,
  authFacebook,
  authGoogle,
  forgotPassword,
  logout,
  company,
  toogle,
  searchText,
  user,
  changePassword,
  updateUser,
  photoUser,
  myDonation,
  myDonationProgress,
  campaigns,
  campaign,
  campaignDonations,
  campaignProgress,
  categories,
  postDonation,
  getDetailDonation,
  banks,
  provinces,
  cities
})
