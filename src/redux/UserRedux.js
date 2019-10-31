import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

export const { Types, Creators } = createActions({
  registerRequest: ['data'],
  registerSuccess: ['data'],
  registerFailure: ['err'],
  confirmRequest: ['data'],
  confirmSuccess: ['data'],
  confirmFailure: ['err'],
  resetPasswordRequest: ['data'],
  resetPasswordSuccess: ['data'],
  resetPasswordFailure: ['err'],
  changePasswordRequest: ['data'],
  changePasswordSuccess: ['data'],
  changePasswordFailure: ['err'],
  userRequest: null,
  userSuccess: ['data'],
  userFailure: ['err'],
  updateUserRequest: ['data'],
  updateUserSuccess: ['data'],
  updateUserFailure: ['err'],
  addPhotoUserRequest: ['data'],
  addPhotoUserSuccess: ['data'],
  addPhotoUserFailure: ['err'],
  myDonationRequest: ['data'],
  myDonationSuccess: ['data'],
  myDonationFailure: ['err'],
  myDonationProgressRequest: ['data'],
  myDonationProgressSuccess: ['data'],
  myDonationProgressFailure: ['err']
})

/* ------------- Initial State ------------- */
const INITIAL_STATE = Immutable({
  isFetching: false,
  isFound: false,
  isFailure: false,
  message: null,
  code: null
})

/* ------------- Reducers ------------- */

const request = (state) => {
  return state.merge({
    isFetching: true,
    message: null
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

const uploadRequest = (state, {data}) => {
  return state.merge({
    isFetching: true,
    message: null
  })
}

const uploadSuccess = (state, { data }) => {
  return state.merge({
    isFetching: false,
    isFound: true,
    isFailure: false,
    ...data
  })
}

const uploadFailure = (state, err) => {
  return state.merge({
    isFetching: false,
    isFailure: true,
    ...err
  })
}
/* ------------- Hookup Reducers To Types ------------- */
export default createReducer(INITIAL_STATE, {
  [Types.REGISTER_SUCCESS]: success,
  [Types.REGISTER_REQUEST]: request,
  [Types.REGISTER_FAILURE]: failure,
  [Types.CONFIRM_SUCCESS]: success,
  [Types.CONFIRM_REQUEST]: request,
  [Types.CONFIRM_FAILURE]: failure,
  [Types.RESET_PASSWORD_SUCCESS]: success,
  [Types.RESET_PASSWORD_REQUEST]: request,
  [Types.RESET_PASSWORD_FAILURE]: failure,
  [Types.USER_SUCCESS]: success,
  [Types.USER_REQUEST]: request,
  [Types.USER_FAILURE]: failure
})

export const updateUserReducer = createReducer(INITIAL_STATE, {
  [Types.UPDATE_USER_SUCCESS]: success,
  [Types.UPDATE_USER_REQUEST]: request,
  [Types.UPDATE_USER_FAILURE]: failure
})

export const photoUserReducer = createReducer(INITIAL_STATE, {
  [Types.ADD_PHOTO_USER_SUCCESS]: uploadSuccess,
  [Types.ADD_PHOTO_USER_REQUEST]: uploadRequest,
  [Types.ADD_PHOTO_USER_FAILURE]: uploadFailure
})

export const myDonationReducer = createReducer(INITIAL_STATE, {
  [Types.MY_DONATION_SUCCESS]: success,
  [Types.MY_DONATION_REQUEST]: request,
  [Types.MY_DONATION_FAILURE]: failure
})

export const myDonationProgressReducer = createReducer(INITIAL_STATE, {
  [Types.MY_DONATION_PROGRESS_SUCCESS]: success,
  [Types.MY_DONATION_PROGRESS_REQUEST]: request,
  [Types.MY_DONATION_PROGRESS_FAILURE]: failure
})

export const changePasswordReducer = createReducer(INITIAL_STATE, {
  [Types.CHANGE_PASSWORD_SUCCESS]: success,
  [Types.CHANGE_PASSWORD_REQUEST]: request,
  [Types.CHANGE_PASSWORD_FAILURE]: failure
})
