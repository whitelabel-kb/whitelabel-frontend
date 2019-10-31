import { fork, all } from 'redux-saga/effects'
import { login, logout, forgot, forgotPassword } from './AuthSaga'
import { authFb, authGoogle } from './AuthSocial'
import { company } from './Company'
import { register, confirm, resetPassword, changePassword, getUser, addPhotoUser, updateUser, getMyDonation, getMyDonationProgress } from './UserSaga'
import { campaigns, campaignsByCategory, campaignDetail, campaignDonations, campaignProgress, postCampaignDonation, postCampaignDonation2, getDetailCampaignDonation } from './CampaignSaga'
import { categories } from './Categories'
import { banks } from './Banks'
import { provinces, cities } from './Location'
import API from '../services/Api'
import getToken from '../services/GetToken'
const api = API.create()

export default function * rootSaga () {
  yield all([
    fork(logout, api, getToken),
    fork(login, api),
    fork(forgot, api),
    fork(forgotPassword, api),
    fork(company, api),
    fork(register, api),
    fork(authFb, api),
    fork(authGoogle, api),
    fork(confirm, api),
    fork(resetPassword, api, getToken), // ex with token
    fork(changePassword, api, getToken),
    fork(getUser, api, getToken),
    fork(getMyDonation, api, getToken),
    fork(getMyDonationProgress, api, getToken),
    fork(addPhotoUser, api, getToken),
    fork(updateUser, api, getToken),
    fork(campaigns, api),
    fork(campaignsByCategory, api),
    fork(campaignDetail, api),
    fork(campaignDonations, api),
    fork(campaignProgress, api),
    fork(postCampaignDonation, api, getToken),
    fork(postCampaignDonation2, api),
    fork(getDetailCampaignDonation, api),
    fork(categories, api),
    fork(banks, api),
    fork(provinces, api),
    fork(cities, api)
  ])
}
