import {put, call} from 'redux-saga/effects'
import {Types, Creators as Actions} from '../redux/Bank'
import { baseListen } from './BaseSaga'

export function * banks (api) {
  yield baseListen(Types.BANKS_REQUEST, banksApi, api)
}

export function * banksApi (api, { data }) {
  const res = yield call(api.listBanks, data)
  if (!res.ok) {
    yield put(Actions.banksFailure(res.data.error))
  }
  if (!res.data.error) {
    yield put(Actions.banksSuccess(res.data))
  } else {
    yield put(Actions.banksFailure(res.data.error))
  }
}
