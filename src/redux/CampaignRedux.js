import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

export const { Types, Creators } = createActions({
  campaignsRequest: ['data'],
  campaignsSuccess: ['data'],
  campaignsFailure: ['err'],
  campaignsByCategoryRequest: ['data'],
  campaignsByCategorySuccess: ['data'],
  campaignsByCategoryFailure: ['err'],
  campaignDetailRequest: ['data'],
  campaignDetailSuccess: ['data'],
  campaignDetailFailure: ['err'],
  campaignDonationsRequest: ['data'],
  campaignDonationsSuccess: ['data'],
  campaignDonationsFailure: ['err'],
  campaignProgressRequest: ['data'],
  campaignProgressSuccess: ['data'],
  campaignProgressFailure: ['err'],
  postCampaignDonationRequest: ['data'],
  postCampaignDonationSuccess: ['data'],
  postCampaignDonationFailure: ['err'],
  postCampaignDonation2Failure: ['err'],
  postCampaignDonation2Request: ['data'],
  postCampaignDonation2Success: ['data'],
  getDetailCampaignDonationRequest: ['data'],
  getDetailCampaignDonationSuccess: ['data'],
  getDetailCampaignDonationFailure: ['err']
})

/* ------------- Initial State ------------- */
const INITIAL_STATE = Immutable({
  isFetching: false,
  isFailure: false,
  message: null
})

/* ------------- Reducers ------------- */

const request = (state, { data }) => {
  return state.merge({
    isFetching: true,
    isFound: false,
    message: null,
    data: null
  })
}

const success = (state, { data }) => {
  return state.merge({
    isFetching: false,
    isFound: true,
    isFailure: false,
    ...data
  })
}

const failure = (state, { err }) => {
  return state.merge({
    isFetching: false,
    isFailure: true,
    ...err
  })
}

/* ------------- Hookup Reducers To Types ------------- */
export const campaignsReducer = createReducer(INITIAL_STATE, {
  [Types.CAMPAIGNS_SUCCESS]: success,
  [Types.CAMPAIGNS_REQUEST]: request,
  [Types.CAMPAIGNS_FAILURE]: failure,
  [Types.CAMPAIGNS_BY_CATEGORY_SUCCESS]: success,
  [Types.CAMPAIGNS_BY_CATEGORY_REQUEST]: request,
  [Types.CAMPAIGNS_BY_CATEGORY_FAILURE]: failure
})

export const campaignReducer = createReducer(INITIAL_STATE, {
  [Types.CAMPAIGN_DETAIL_SUCCESS]: success,
  [Types.CAMPAIGN_DETAIL_REQUEST]: request,
  [Types.CAMPAIGN_DETAIL_FAILURE]: failure
})

export const campaignDonationsReducer = createReducer(INITIAL_STATE, {
  [Types.CAMPAIGN_DONATIONS_SUCCESS]: success,
  [Types.CAMPAIGN_DONATIONS_REQUEST]: request,
  [Types.CAMPAIGN_DONATIONS_FAILURE]: failure
})

export const campaignProgressReducer = createReducer(INITIAL_STATE, {
  [Types.CAMPAIGN_PROGRESS_SUCCESS]: success,
  [Types.CAMPAIGN_PROGRESS_REQUEST]: request,
  [Types.CAMPAIGN_PROGRESS_FAILURE]: failure
})

export const postCampaignDonationReducer = createReducer(INITIAL_STATE, {
  [Types.POST_CAMPAIGN_DONATION_SUCCESS]: success,
  [Types.POST_CAMPAIGN_DONATION_REQUEST]: request,
  [Types.POST_CAMPAIGN_DONATION_FAILURE]: failure,
  [Types.POST_CAMPAIGN_DONATION2_SUCCESS]: success,
  [Types.POST_CAMPAIGN_DONATION2_REQUEST]: request,
  [Types.POST_CAMPAIGN_DONATION2_FAILURE]: failure
})

export const getDetailCampaignDonationReducer = createReducer(INITIAL_STATE, {
  [Types.GET_DETAIL_CAMPAIGN_DONATION_SUCCESS]: success,
  [Types.GET_DETAIL_CAMPAIGN_DONATION_REQUEST]: request,
  [Types.GET_DETAIL_CAMPAIGN_DONATION_FAILURE]: failure
})
