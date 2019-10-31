import {put, call} from 'redux-saga/effects'
import {Types, Creators as Actions} from '../redux/Categories'
import { baseListen } from './BaseSaga'

export function * categories (api) {
  yield baseListen(Types.CATEGORIES_REQUEST, categoriesApi, api)
}

export function * categoriesApi (api, { data }) {
  const res = yield call(api.getCategory, data)
  if (!res.ok) {
    yield put(Actions.categoriesFailure(res.data.error))
  }
  if (!res.data.error) {
    yield put(Actions.categoriesSuccess(res.data))
  } else {
    yield put(Actions.categoriesFailure(res.data.error))
  }
}
