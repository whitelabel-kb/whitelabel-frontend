import React from 'react'
import DefaultLayout from '../src/layout/DefaultLayout'
import {withReduxSaga} from '../src/redux/store'
import ForgotPassword from '../src/containers/ForgotPassword'

class Page extends React.Component {
  static getInitialProps (props) {
    const { query } = props
    return {
      token: query.access_token || null,
      uid: query.uid || null
    }
  }
  render () {
    return (
      <DefaultLayout>
        <ForgotPassword {...this.props} />
      </DefaultLayout>
    )
  }
}

export default withReduxSaga(Page)
