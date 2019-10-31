import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

export const { Types, Creators } = createActions({
  authFbRequest: ['data'],
  authFbSuccess: ['data'],
  authFbFailure: ['err'],
  authGoogleRequest: ['data'],
  authGoogleSuccess: ['data'],
  authGoogleFailure: ['err']
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

/* ------------- Hookup Reducers To Types ------------- */
export default createReducer(INITIAL_STATE, {
  [Types.AUTH_FB_SUCCESS]: success,
  [Types.AUTH_FB_REQUEST]: request,
  [Types.AUTH_FB_FAILURE]: failure
})

export const authGoogleReducer = createReducer(INITIAL_STATE, {
  [Types.AUTH_GOOGLE_SUCCESS]: success,
  [Types.AUTH_GOOGLE_REQUEST]: request,
  [Types.AUTH_GOOGLE_FAILURE]: failure
})
