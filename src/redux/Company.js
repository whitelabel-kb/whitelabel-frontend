import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */
export const { Types, Creators } = createActions({
  companyRequest: ['data'],
  companySuccess: ['data'],
  companyFailure: ['err']
})

/* ------------- Initial State ------------- */
const INITIAL_STATE = Immutable({
  isFetching: false,
  isFound: false,
  isFailure: false,
  message: null
})

/* ------------- Reducers ------------- */
const request = (state, {data}) => {
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
  [Types.COMPANY_SUCCESS]: success,
  [Types.COMPANY_REQUEST]: request,
  [Types.COMPANY_FAILURE]: failure
})
