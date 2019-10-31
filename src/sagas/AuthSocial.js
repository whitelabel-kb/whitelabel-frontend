import {put, call} from 'redux-saga/effects'
import {Types, Creators as Actions} from '../redux/AuthSocial'
import { baseListen } from './BaseSaga'
import Cookies from 'universal-cookie'
const cookies = new Cookies()

export function * authFb (api) {
  yield baseListen(Types.AUTH_FB_REQUEST, authFbApi, api)
}

export function * authFbApi (api, { data }) {
  const res = yield call(api.authFb, data)
  if (!res.ok) {
    yield put(Actions.authFbFailure(res.data.error))
  }
  if (!res.data.error) {
    yield cookies.set('access_token', `${res.data.data.accessToken}`, { path: '/' })
    yield put(Actions.authFbSuccess(res.data))
  } else {
    yield put(Actions.authFbFailure(res.data.error))
  }
}

export function * authGoogle (api) {
  yield baseListen(Types.AUTH_GOOGLE_REQUEST, authGoogleApi, api)
}

export function * authGoogleApi (api, { data }) {
  const res = yield call(api.authGoogle, data)
  if (!res.ok) {
    yield put(Actions.authGoogleFailure(res.data.error))
  }
  if (!res.data.error) {
    yield cookies.set('access_token', `${res.data.data.accessToken}`, { path: '/' })
    yield put(Actions.authGoogleSuccess(res.data))
  } else {
    yield put(Actions.authGoogleFailure(res.data.error))
  }
}
