import React from 'react'
import { checkAuth } from '../src/utils/checkAuth'
import DefaultLayout from '../src/layout/DefaultLayout'
import {withReduxSaga} from '../src/redux/store'
import ChangePassword from '../src/containers/ChangePassword'

class Page extends React.Component {
  // check page has token in cookie
  static async getInitialProps ({ req, res }) {
    checkAuth(req, res)
  }

  render () {
    return (
      <DefaultLayout>
        <ChangePassword />
      </DefaultLayout>
    )
  }
}

export default withReduxSaga(Page)
