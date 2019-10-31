import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

export const { Types, Creators } = createActions({
  authRequest: ['data'],
  authSuccess: ['data'],
  authFailure: ['err'],
  authLogoutRequest: ['data'],
  authLogoutSuccess: ['data'],
  authLogoutFailure: ['err'],
  forgotRequest: ['data'],
  forgotSuccess: ['data'],
  forgotFailure: ['err'],
  forgotPasswordRequest: ['data'],
  forgotPasswordSuccess: ['data'],
  forgotPasswordFailure: ['err'],
  resetAuth: ['data']
})

/* ------------- Initial State ------------- */
const INITIAL_STATE = Immutable({
  isFetching: false,
  isFound: false,
  isFailure: false,
  message: null
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

const reset = (state, { err }) => {
  return state.merge({
    isFetching: false,
    isFound: false,
    isFailure: false,
    message: null
  })
}

/* ------------- Hookup Reducers To Types ------------- */
export default createReducer(INITIAL_STATE, {
  [Types.AUTH_SUCCESS]: success,
  [Types.AUTH_REQUEST]: request,
  [Types.AUTH_FAILURE]: failure,
  [Types.RESET_AUTH]: reset
})

export const logoutReducer = createReducer(INITIAL_STATE, {
  [Types.AUTH_LOGOUT_SUCCESS]: success,
  [Types.AUTH_LOGOUT_REQUEST]: request,
  [Types.AUTH_LOGOUT_FAILURE]: failure
})

export const forgotPasswordReducer = createReducer(INITIAL_STATE, {
  [Types.FORGOT_SUCCESS]: success,
  [Types.FORGOT_REQUEST]: request,
  [Types.FORGOT_FAILURE]: failure,
  [Types.FORGOT_PASSWORD_SUCCESS]: success,
  [Types.FORGOT_PASSWORD_REQUEST]: request,
  [Types.FORGOT_PASSWORD_FAILURE]: failure
})
