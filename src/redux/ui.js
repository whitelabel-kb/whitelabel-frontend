import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */
export const { Types, Creators } = createActions({
  toogleRequest: ['data'],
  searchText: ['data']
})

/* ------------- Initial State ------------- */
const INITIAL_STATE = Immutable({
  isToogled: false
})

const INITIAL_STATE2 = Immutable({
  searchText: ''
})

/* ------------- Reducers ------------- */
const request = (state, {data}) => {
  return state.merge({
    isToogled: data.toogle
  })
}

const searchRequest = (state, {data}) => {
  return state.merge({
    searchText: data.search
  })
}

/* ------------- Hookup Reducers To Types ------------- */
export default createReducer(INITIAL_STATE, {
  [Types.TOOGLE_REQUEST]: request
})

export const searchText = createReducer(INITIAL_STATE2, {
  [Types.SEARCH_TEXT]: searchRequest
})
