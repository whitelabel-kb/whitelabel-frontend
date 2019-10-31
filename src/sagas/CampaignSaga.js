import { put, call } from 'redux-saga/effects'
import { Types, Creators as Actions } from '../redux/CampaignRedux'
import { baseListen, baseFetchToken } from './BaseSaga'

export function * campaigns (api) {
  yield baseListen(Types.CAMPAIGNS_REQUEST, campaignsApi, api)
}

export function * campaignsApi (api, {data}) {
  const res = yield call(api.getCampaigns, data)
  let isSearch = data && data.filter ? !false : false
  let resData = { ...res.data, isSearch }
  if (!res.ok) {
    yield put(Actions.campaignsFailure(res.data.error))
  }
  if (!res.data.error) {
    yield put(Actions.campaignsSuccess(resData))
  } else {
    yield put(Actions.campaignsFailure(res.data.error))
  }
}

export function * campaignsByCategory (api) {
  yield baseListen(Types.CAMPAIGNS_BY_CATEGORY_REQUEST, campaignsByCategoryApi, api)
}

export function * campaignsByCategoryApi (api, { data }) {
  const res = yield call(api.getCampaignByCategory, data)
  let resData = { ...res.data, isSearch: true }
  if (!res.ok) {
    yield put(Actions.campaignsByCategoryFailure(res.data.error))
  }
  if (!res.data.error) {
    yield put(Actions.campaignsByCategorySuccess(resData))
  } else {
    yield put(Actions.campaignsByCategoryFailure(res.data.error))
  }
}

export function * campaignDetail (api) {
  yield baseListen(Types.CAMPAIGN_DETAIL_REQUEST, campaignDetailApi, api)
}

export function * campaignDetailApi (api, {data}) {
  const res = yield call(api.getCampaign, data)
  if (!res.ok) {
    yield put(Actions.campaignDetailFailure(res.data.error))
  }
  if (!res.data.error) {
    yield put(Actions.campaignDetailSuccess(res.data))
  } else {
    yield put(Actions.campaignDetailFailure(res.data.error))
  }
}

export function * campaignDonations (api) {
  yield baseListen(Types.CAMPAIGN_DONATIONS_REQUEST, campaignDonationsApi, api)
}

export function * campaignDonationsApi (api, {data}) {
  const res = yield call(api.getCampaignDonations, data)
  if (!res.ok) {
    yield put(Actions.campaignDonationsFailure(res.data.error))
  }
  if (!res.data.error) {
    yield put(Actions.campaignDonationsSuccess(res.data))
  } else {
    yield put(Actions.campaignDonationsFailure(res.data.error))
  }
}

export function * campaignProgress (api) {
  yield baseListen(Types.CAMPAIGN_PROGRESS_REQUEST, campaignProgressApi, api)
}

export function * campaignProgressApi (api, {data}) {
  const res = yield call(api.getCampaignProgress, data)
  if (!res.ok) {
    yield put(Actions.campaignProgressFailure(res.data.error))
  }
  if (!res.data.error) {
    yield put(Actions.campaignProgressSuccess(res.data))
  } else {
    yield put(Actions.campaignProgressFailure(res.data.error))
  }
}

export function * postCampaignDonation (api, getToken) {
  yield baseListen(Types.POST_CAMPAIGN_DONATION_REQUEST, postCampaignDonationApi, api, getToken)
}

export function * postCampaignDonationApi (api, getToken, { data }) {
  yield baseFetchToken(api.postCampaignDonations, data, getToken, Actions.postCampaignDonationSuccess, Actions.postCampaignDonationFailure)
}

export function * postCampaignDonation2 (api) {
  yield baseListen(Types.POST_CAMPAIGN_DONATION2_REQUEST, postCampaignDonation2Api, api)
}

export function * postCampaignDonation2Api (api, {data}) {
  const res = yield call(api.postCampaignDonations2, data)
  if (!res.ok) {
    yield put(Actions.postCampaignDonation2Failure(res.data.error))
  }
  if (!res.data.error) {
    yield put(Actions.postCampaignDonation2Success(res.data))
  } else {
    yield put(Actions.postCampaignDonation2Failure(res.data.error))
  }
}

export function * getDetailCampaignDonation (api) {
  yield baseListen(Types.GET_DETAIL_CAMPAIGN_DONATION_REQUEST, getDetailCampaignDonationApi, api)
}

export function * getDetailCampaignDonationApi (api, {data}) {
  const res = yield call(api.getDetailCampaignDonation, data)
  if (!res.ok) {
    yield put(Actions.getDetailCampaignDonationFailure(res.data.error))
  }
  if (res.data && !res.data.error) {
    yield put(Actions.getDetailCampaignDonationSuccess(res.data))
  } else {
    yield put(Actions.getDetailCampaignDonationFailure(res.data.error))
  }
}
