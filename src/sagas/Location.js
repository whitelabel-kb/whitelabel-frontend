import {put, call} from 'redux-saga/effects'
import {Types, Creators as Actions} from '../redux/Location'
import { baseListen } from './BaseSaga'

export function * provinces (api) {
  yield baseListen(Types.PROVINCES_REQUEST, provincesApi, api)
}

export function * provincesApi (api, { data }) {
  const res = yield call(api.listProvinces, data)
  if (!res.ok) {
    yield put(Actions.provincesFailure(res.data.error))
  }
  if (!res.data.error) {
    yield put(Actions.provincesSuccess(res.data))
  } else {
    yield put(Actions.provincesFailure(res.data.error))
  }
}

export function * cities (api) {
  yield baseListen(Types.CITIES_REQUEST, citiesApi, api)
}

export function * citiesApi (api, { data }) {
  const res = yield call(api.listCities, data)
  if (!res.ok) {
    yield put(Actions.citiesFailure(res.data.error))
  }
  if (!res.data.error) {
    yield put(Actions.citiesSuccess(res.data))
  } else {
    yield put(Actions.citiesFailure(res.data.error))
  }
}
