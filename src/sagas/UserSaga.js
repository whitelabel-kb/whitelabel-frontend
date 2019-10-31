import {put, call} from 'redux-saga/effects'
import {Types, Creators as Actions} from '../redux/UserRedux'
import { baseListen, baseFetchToken } from './BaseSaga'

export function * register (api) {
  yield baseListen(Types.REGISTER_REQUEST, registerApi, api)
}

export function * registerApi (api, { data }) {
  const res = yield call(api.register, data)
  if (!res.ok) {
    yield put(Actions.registerFailure(res.data.error))
  }
  if (!res.data.error) {
    yield put(Actions.registerSuccess(res.data))
  } else {
    yield put(Actions.registerFailure(res.data.error))
  }
}

export function * confirm (api) {
  yield baseListen(Types.CONFIRM_REQUEST, confirmApi, api)
}

export function * confirmApi (api, { data }) {
  const res = yield call(api.confirm, data)
  if (!res.ok) {
    yield put(Actions.confirmFailure(res.data.error))
  }
  if (!res.data.error) {
    yield put(Actions.confirmSuccess(res.data))
  } else {
    yield put(Actions.confirmFailure(res.data.error))
  }
}

export function * resetPassword (api, getToken) {
  yield baseListen(Types.RESET_PASSWORD_REQUEST, resetPasswordApi, api, getToken)
}

export function * resetPasswordApi (api, getToken, { data }) {
  yield baseFetchToken(api.resetPassword, data, getToken, Actions.resetPasswordSuccess, Actions.resetPasswordFailure)
}

export function * changePassword (api, getToken) {
  yield baseListen(Types.CHANGE_PASSWORD_REQUEST, changePasswordApi, api, getToken)
}

export function * changePasswordApi (api, getToken, { data }) {
  yield baseFetchToken(api.changePassword, data, getToken, Actions.changePasswordSuccess, Actions.changePasswordFailure)
}

export function * getUser (api, getToken) {
  yield baseListen(Types.USER_REQUEST, getUserApi, api, getToken)
}

export function * getUserApi (api, getToken, { data }) {
  yield baseFetchToken(api.getUser, data, getToken, Actions.userSuccess, Actions.userFailure)
}

export function * updateUser (api, getToken) {
  yield baseListen(Types.UPDATE_USER_REQUEST, updateUserApi, api, getToken)
}

export function * updateUserApi (api, getToken, { data }) {
  yield baseFetchToken(api.updateUser, data, getToken, Actions.updateUserSuccess, Actions.updateUserFailure)
}

export function * addPhotoUser (api, getToken) {
  yield baseListen(Types.ADD_PHOTO_USER_REQUEST, addPhotoUserApi, api, getToken)
}

export function * addPhotoUserApi (api, getToken, { data }) {
  yield baseFetchToken(api.addPhotoUser, data, getToken, Actions.addPhotoUserSuccess, Actions.addPhotoUserFailure)
}

export function * getMyDonation (api, getToken) {
  yield baseListen(Types.MY_DONATION_REQUEST, getMyDonationApi, api, getToken)
}

export function * getMyDonationApi (api, getToken, { data }) {
  yield baseFetchToken(api.getMyDonation, data, getToken, Actions.myDonationSuccess, Actions.myDonationFailure)
}

export function * getMyDonationProgress (api, getToken) {
  yield baseListen(Types.MY_DONATION_PROGRESS_REQUEST, getMyDonationProgressApi, api, getToken)
}

export function * getMyDonationProgressApi (api, getToken, { data }) {
  yield baseFetchToken(api.getMyDonationProgress, data, getToken, Actions.myDonationProgressSuccess, Actions.myDonationProgressFailure)
}
