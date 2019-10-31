import React from 'react'
import DefaultLayout from '../src/layout/DefaultLayout'
import {withReduxSaga} from '../src/redux/store'
import Overview from '../src/containers/Overview'
import { checkAuth } from '../src/utils/checkAuth'

class Page extends React.Component {
  // check page has token in cookie
  static async getInitialProps ({ req, res }) {
    checkAuth(req, res)
  }

  render () {
    return (
      <DefaultLayout>
        <Overview />
      </DefaultLayout>
    )
  }
}

export default withReduxSaga(Page)
