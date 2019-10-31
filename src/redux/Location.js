import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

export const { Types, Creators } = createActions({
  provincesRequest: ['data'],
  provincesSuccess: ['data'],
  provincesFailure: ['err'],
  citiesRequest: ['data'],
  citiesSuccess: ['data'],
  citiesFailure: ['err']
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
    isFound: false,
    isFailure: true,
    ...err
  })
}

/* ------------- Hookup Reducers To Types ------------- */
export default createReducer(INITIAL_STATE, {
  [Types.PROVINCES_SUCCESS]: success,
  [Types.PROVINCES_REQUEST]: request,
  [Types.PROVINCES_FAILURE]: failure
})

export const citiesReducer = createReducer(INITIAL_STATE, {
  [Types.CITIES_SUCCESS]: success,
  [Types.CITIES_REQUEST]: request,
  [Types.CITIES_FAILURE]: failure
})
