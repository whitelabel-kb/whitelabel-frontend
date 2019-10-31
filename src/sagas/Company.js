import { put, call } from 'redux-saga/effects'
import { Types, Creators as Actions } from '../redux/Company'
import { baseListen } from './BaseSaga'

export function * company (api) {
  yield baseListen(Types.COMPANY_REQUEST, companyApi, api)
}

export function * companyApi (api, {data}) {
  const res = yield call(api.getCompany, data)
  if (!res.ok) {
    yield put(Actions.companyFailure(res.data.error))
  }
  if (!res.data.error) {
    yield put(Actions.companySuccess(res.data))
  } else {
    yield put(Actions.companyFailure(res.data.error))
  }
}
