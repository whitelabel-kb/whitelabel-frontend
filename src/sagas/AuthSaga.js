import {put, call} from 'redux-saga/effects'
// import {END} from 'redux-saga'
import {Types as AuthTypes, Creators as AuthActions} from '../redux/AuthRedux'
import Cookies from 'universal-cookie'
// import validate from '../config/Validator'
// import AuthValidator from '../validations/Auth'
import { baseListen, baseFetchLogout } from './BaseSaga'
const cookies = new Cookies()

// attempts to login
export function * login (api) {
  yield baseListen(AuthTypes.AUTH_REQUEST,
    fetchLoginAPI,
    api)
}

export function * fetchLoginAPI (api, { data }) {
  const res = yield call(api.login, data)
  if (!res.ok) {
    yield put(AuthActions.authFailure(res.data.error))
  }
  if (!res.data.error) {
    yield cookies.set('access_token', `${res.data.data.token}`, { path: '/' })
    yield put(AuthActions.authSuccess(res.data))
  } else {
    yield put(AuthActions.authFailure(res.data.error))
  }
}

export function * forgot (api) {
  yield baseListen(AuthTypes.FORGOT_REQUEST, forgotApi, api)
}

export function * forgotApi (api, { data }) {
  const res = yield call(api.forgot, data)
  if (!res.ok) {
    yield put(AuthActions.forgotFailure(res.data.error))
  }
  if (!res.data.error) {
    yield put(AuthActions.forgotSuccess(res.data))
  } else {
    yield put(AuthActions.forgotFailure(res.data.error))
  }
}

export function * forgotPassword (api) {
  yield baseListen(AuthTypes.FORGOT_PASSWORD_REQUEST, forgotPasswordApi, api)
}

export function * forgotPasswordApi (api, { data }) {
  const res = yield call(api.forgotPassword, data)
  if (!res.ok) {
    yield put(AuthActions.forgotPasswordFailure(res.data.error))
  }
  if (!res.data.error) {
    yield put(AuthActions.forgotPasswordSuccess(res.data))
  } else {
    yield put(AuthActions.forgotPasswordFailure(res.data.error))
  }
}

export function * logout (api, getToken) {
  yield baseListen(AuthTypes.AUTH_LOGOUT_REQUEST, getMyDonationApi, api, getToken)
}

export function * getMyDonationApi (api, getToken, { data }) {
  yield baseFetchLogout(api.logout, data, getToken, AuthActions.authLogoutSuccess, AuthActions.authLogoutFailure)
}
